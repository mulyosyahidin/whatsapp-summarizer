<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class JobController extends Controller
{
    /**
     * Display a listing of the jobs.
     */
    public function index(): Response
    {
        $jobs = DB::table('jobs')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($job) {
                $payload = json_decode($job->payload, true);

                return [
                    'id' => $job->id,
                    'queue' => $job->queue,
                    'display_name' => $payload['displayName'] ?? 'Unknown',
                    'attempts' => $job->attempts,
                    'available_at' => date('Y-m-d H:i:s', $job->available_at),
                    'created_at' => date('Y-m-d H:i:s', $job->created_at),
                    'status' => 'pending',
                ];
            });

        $failedJobs = DB::table('failed_jobs')
            ->orderBy('failed_at', 'desc')
            ->get()
            ->map(function ($job) {
                $payload = json_decode($job->payload, true);

                return [
                    'id' => $job->id,
                    'uuid' => $job->uuid,
                    'queue' => $job->queue,
                    'display_name' => $payload['displayName'] ?? 'Unknown',
                    'failed_at' => $job->failed_at,
                    'status' => 'failed',
                ];
            });

        return Inertia::render('jobs/index', [
            'jobs' => $jobs,
            'failedJobs' => $failedJobs,
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
}
