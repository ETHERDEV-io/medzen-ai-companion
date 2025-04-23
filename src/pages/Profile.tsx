
import { Card } from "@/components/ui/card";

export default function Profile() {
  return (
    <main className="flex flex-col items-center w-full min-h-screen bg-gradient-to-tr from-[#1a1f2c] to-[#221f26] pt-8 pb-8">
      <div className="w-full max-w-2xl px-4 mx-auto">
        <h1 className="text-3xl font-extrabold text-white mb-3">Profile</h1>
        <Card className="p-6 rounded-xl bg-card bg-opacity-80">
          <div className="text-white">This is your profile. Future: add avatar, info, stats etc.</div>
        </Card>
      </div>
    </main>
  );
}
