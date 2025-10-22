import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
    } else {
      setUser(JSON.parse(userData));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-black">NoteTect</h1>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-gray-300 hover:bg-gray-100"
            >
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-3xl font-bold text-black mb-4">
            Welcome, {user.username}!
          </h2>
          <p className="text-gray-600 mb-2">Email: {user.email}</p>
          <p className="text-gray-600">User ID: {user.userId}</p>
          
          <div className="mt-8">
            <p className="text-gray-500">
              Your dashboard is ready. Start organizing your notes!
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
