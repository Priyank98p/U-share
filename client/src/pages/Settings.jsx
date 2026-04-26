import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateUser } from "@/store/authSlice";
import axiosInstance from "@/api/axiosInstance";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, Save, ShieldCheck, Upload, CheckCircle } from "lucide-react";
import { useToast } from "@/context/ToastContext";

export default function Settings() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const toast = useToast();

  const [form, setForm] = useState({
    fullname: user?.fullname || "",
    department: user?.department || "",
    year: user?.year?.toString() || "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [idCardFile, setIdCardFile] = useState(null);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const res = await axiosInstance.patch("/users/profile", form);
      dispatch(updateUser(res.data.data));
      toast.success("Profile updated!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) return;
    const formData = new FormData();
    formData.append("avatar", avatarFile);
    try {
      const res = await axiosInstance.patch("/users/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      dispatch(updateUser(res.data.data));
      setAvatarFile(null);
      setAvatarPreview(null);
      toast.success("Avatar updated!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to upload avatar");
    }
  };

  const handleIdCardUpload = async () => {
    if (!idCardFile) return;
    const formData = new FormData();
    formData.append("studentIdCard", idCardFile);
    try {
      const res = await axiosInstance.patch("/users/student-id", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      dispatch(updateUser(res.data.data));
      setIdCardFile(null);
      toast.success("Student ID card updated!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to upload ID card");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-start">
      <DashboardSidebar />

      <main className="flex-1 p-6 lg:p-10 max-w-[900px] w-full animate-in fade-in duration-500">
        <div className="mb-10">
          <h1 className="font-heading text-3xl font-black tracking-tight text-slate-900 mb-2">Settings</h1>
          <p className="text-slate-500 font-medium">Manage your profile, avatar, and student verification.</p>
        </div>

        {/* Avatar Section */}
        <section className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-slate-200 shadow-sm mb-8">
          <h2 className="font-heading text-xl font-bold text-slate-900 tracking-tight mb-6">Profile Photo</h2>
          <div className="flex items-center gap-8">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-indigo-100 shadow-lg">
                <img
                  src={avatarPreview || user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.fullname}`}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <label className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Camera className="w-6 h-6 text-white" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setAvatarFile(file);
                      setAvatarPreview(URL.createObjectURL(file));
                    }
                  }}
                />
              </label>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-700 mb-1">Upload a new photo</p>
              <p className="text-xs text-slate-400 mb-4">JPG, PNG or WEBP. Max 2MB.</p>
              {avatarFile && (
                <Button onClick={handleAvatarUpload} className="rounded-xl font-bold px-6 shadow-lg shadow-indigo-600/20">
                  <Upload className="w-4 h-4 mr-2" /> Upload
                </Button>
              )}
            </div>
          </div>
        </section>

        {/* Profile Form */}
        <section className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-slate-200 shadow-sm mb-8">
          <h2 className="font-heading text-xl font-bold text-slate-900 tracking-tight mb-6">Personal Information</h2>
          <form onSubmit={handleProfileSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-slate-700 font-bold text-sm">Username</Label>
                <Input value={user?.username || ""} disabled className="h-12 bg-slate-50 rounded-xl opacity-60" />
                <p className="text-xs text-slate-400">Username cannot be changed</p>
              </div>
              <div className="space-y-2">
                <Label className="text-slate-700 font-bold text-sm">Email</Label>
                <Input value={user?.email || ""} disabled className="h-12 bg-slate-50 rounded-xl opacity-60" />
                <p className="text-xs text-slate-400">Email cannot be changed</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-700 font-bold text-sm">Full Name</Label>
              <Input
                value={form.fullname}
                onChange={(e) => setForm({ ...form, fullname: e.target.value })}
                className="h-12 bg-slate-50 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
                placeholder="Your full name"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-slate-700 font-bold text-sm">Department</Label>
                <Input
                  value={form.department}
                  onChange={(e) => setForm({ ...form, department: e.target.value })}
                  className="h-12 bg-slate-50 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
                  placeholder="e.g. Computer Science"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-700 font-bold text-sm">Year</Label>
                <select
                  value={form.year}
                  onChange={(e) => setForm({ ...form, year: e.target.value })}
                  className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-medium focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none"
                >
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSaving}
              className="rounded-xl font-bold h-12 px-8 shadow-lg shadow-indigo-600/20 transition-all active:scale-[0.98]"
            >
              {isSaving ? "Saving..." : <><Save className="w-4 h-4 mr-2" /> Save Changes</>}
            </Button>
          </form>
        </section>

        {/* Student ID Card */}
        <section className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-slate-200 shadow-sm mb-8">
          <h2 className="font-heading text-xl font-bold text-slate-900 tracking-tight mb-2">Student ID Verification</h2>
          <p className="text-sm text-slate-500 mb-6">Upload your student ID card for campus verification.</p>
          
          <div className="flex items-center gap-6">
            {user?.studentIdCard && (
              <div className="w-48 h-32 rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 shadow-sm">
                <img src={user.studentIdCard} alt="Student ID" className="w-full h-full object-cover" />
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <span className="text-sm font-bold text-emerald-700">{user?.isVerified ? "Verified" : "Pending Verification"}</span>
              </div>
              <label className="flex items-center gap-2 px-4 py-3 bg-slate-50 border border-dashed border-slate-300 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                <Upload className="w-4 h-4 text-slate-500" />
                <span className="text-sm font-bold text-slate-600">{idCardFile ? idCardFile.name : "Choose new ID card..."}</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setIdCardFile(e.target.files?.[0] || null)}
                />
              </label>
              {idCardFile && (
                <Button onClick={handleIdCardUpload} className="mt-3 rounded-xl font-bold px-6 shadow-lg shadow-indigo-600/20">
                  <Upload className="w-4 h-4 mr-2" /> Upload New ID
                </Button>
              )}
            </div>
          </div>
        </section>
      </main>

    </div>
  );
}
