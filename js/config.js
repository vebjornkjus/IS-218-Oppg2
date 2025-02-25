const CONFIG = {
    supabase: {
        url: 'https://twxrfjjeztbgyjxftyec.supabase.co',
        key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3eHJmamplenRiZ3lqeGZ0eWVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYyNTgzMzQsImV4cCI6MjA1MTgzNDMzNH0.A5Rh4yrDJpQqsDDKxjHcXWbXcwwhkL3kTEu1QaeCsfg'
    },
    map: {
        center: [58.1467, 7.9956],
        zoom: 1,
        tileLayer: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    }
};

const supabaseClient = supabase.createClient(CONFIG.supabase.url, CONFIG.supabase.key);