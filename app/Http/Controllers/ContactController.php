<?php

namespace App\Http\Controllers;

use App\Http\Resources\ContactResource;
use App\Models\Contact;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;

class ContactController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Contact::with('chat')->orderBy('name');

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('jid', 'like', "%{$request->search}%")
                    ->orWhere('name', 'like', "%{$request->search}%");
            });
        }

        return Inertia::render('contacts/index', [
            'contacts' => ContactResource::collection($query->paginate($request->input('limit', 10))->withQueryString()),
            'filters' => $request->only(['search', 'limit']),
        ]);
    }

    /**
     * Sync contacts from API.
     */
    public function sync()
    {
        $baseUrl = config('wag.base_url');
        $username = config('wag.auth.username');
        $password = config('wag.auth.password');

        try {
            $response = Http::withBasicAuth($username, $password)
                ->get($baseUrl.'/user/my/contacts');

            if (! $response->successful()) {
                return back()->with('error', 'Gagal mengambil data kontak dari API');
            }

            $data = $response->json('results.data') ?? [];
            $totalSynced = 0;

            foreach ($data as $contactData) {
                Contact::updateOrCreate(
                    ['jid' => $contactData['jid']],
                    ['name' => $contactData['name']]
                );
                $totalSynced++;
            }

            return back()->with('success', "Berhasil sinkronisasi {$totalSynced} kontak");
        } catch (\Exception $e) {
            return back()->with('error', 'Terjadi kesalahan saat sinkronisasi: '.$e->getMessage());
        }
    }
}
