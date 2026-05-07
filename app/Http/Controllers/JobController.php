<?php

namespace App\Http\Controllers;

use App\Http\Resources\JobResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class JobController extends Controller
{
    /**
     * Display a listing of the jobs.
     */
    public function index(Request $request): Response
    {
        $limit = $request->input('limit', 10);

        $jobs = DB::table('jobs')
            ->orderBy('created_at', 'asc')
            ->paginate($limit, ['*'], 'pending_page')
            ->withQueryString();

        $failedJobs = DB::table('failed_jobs')
            ->orderBy('failed_at', 'desc')
            ->paginate($limit, ['*'], 'failed_page')
            ->withQueryString();

        return Inertia::render('jobs/index', [
            'jobs' => JobResource::collection($jobs),
            'failedJobs' => JobResource::collection($failedJobs->through(fn ($job) => (object) array_merge((array) $job, ['status' => 'failed']))),
            'filters' => $request->only(['limit']),
        ]);
    }

    /**
     * Display the specified job.
     */
    public function show(string $type, string $id): Response
    {
        $table = $type === 'failed' ? 'failed_jobs' : 'jobs';
        $job = DB::table($table)->where('id', $id)->first();

        if (! $job) {
            abort(404);
        }

        $payload = json_decode($job->payload, true);
        $jobData = [
            'id' => $job->id,
            'queue' => $job->queue,
            'payload' => $payload,
            'status' => $type,
        ];

        if ($type === 'failed') {
            $jobData['exception'] = $job->exception;
            $jobData['failed_at'] = $job->failed_at;
        } else {
            $jobData['attempts'] = $job->attempts;
            $jobData['created_at'] = date('Y-m-d H:i:s', $job->created_at);
            $jobData['available_at'] = date('Y-m-d H:i:s', $job->available_at);
        }

        return Inertia::render('jobs/show', [
            'job' => $jobData,
        ]);
    }

    /**
     * Retry a failed job.
     */
    public function retry(string $id)
    {
        Artisan::call('queue:retry', ['id' => [$id]]);

        return back()->with('success', 'Job has been pushed back to the queue.');
    }

    /**
     * Retry all failed jobs.
     */
    public function retryAll()
    {
        Artisan::call('queue:retry', ['id' => ['all']]);

        return back()->with('success', 'All failed jobs have been pushed back to the queue.');
    }

    /**
     * Remove the specified job.
     */
    public function destroy(string $type, string $id)
    {
        $table = $type === 'failed' ? 'failed_jobs' : 'jobs';
        DB::table($table)->where('id', $id)->delete();

        return back()->with('success', 'Job has been removed.');
    }
}
