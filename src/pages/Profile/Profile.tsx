import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { type RootState } from "../../store/store";
import { setToken } from "../../UserSlice/userSlice";
import { useNavigate } from "react-router-dom";
import Dialog from "../../components/ui/Dialog";

function parseToken(token: string | null) {
  if (!token) return null;
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      window.atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const decoded = JSON.parse(jsonPayload);
    
    const username =
      decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] ||
      decoded.name ||
      decoded.username ||
      decoded.unique_name ||
      "Exclusive User";
    const email =
      decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] ||
      decoded.email ||
      "user@exclusive.com";
    const phoneNumber =
      decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/mobilephone"] ||
      decoded.phone ||
      "";
    const id =
      decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] ||
      decoded.id ||
      decoded.sub ||
      "";

    return { id, username, email, phoneNumber };
  } catch (e) {
    console.error("Error parsing JWT:", e);
    return null;
  }
}

export default function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.users.token);
  const usersList = useSelector((state: RootState) => state.users.user);

  const [parsedUser, setParsedUser] = useState<{
    id?: string;
    username?: string;
    email?: string;
    phoneNumber?: string;
  } | null>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [job, setJob] = useState("");
  const [avatar, setAvatar] = useState("");

  const [dialog, setDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: "success" | "error" | "info";
  }>({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
  });

  useEffect(() => {
    const userClaims = parseToken(token);
    setParsedUser(userClaims);

    if (userClaims) {
      const matched = usersList.find(
        (u) =>
          u.email.toLowerCase() === userClaims.email.toLowerCase() ||
          u.firstname.toLowerCase() === userClaims.username.toLowerCase()
      );

      if (matched) {
        setFirstName(matched.firstname);
        setLastName(matched.lastname);
        setEmail(matched.email);
        setPhoneNumber(matched.number);
        setCity(matched.city);
        setAddress(matched.adres);
        setJob(matched.job);
        setAvatar(matched.avatar);
      } else {
        setFirstName(userClaims.username || "Exclusive");
        setLastName("User");
        setEmail(userClaims.email || "");
        setPhoneNumber(userClaims.phoneNumber || "");
        setCity("New York");
        setAddress("Fifth Avenue");
        setJob("Customer");
        setAvatar("https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/male/512/1.jpg");
      }
    }
  }, [token, usersList]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setDialog({
      isOpen: true,
      title: "Success",
      message: "Your profile details have been saved successfully!",
      type: "success",
    });
  };

  const handleLogout = () => {
    dispatch(setToken(null));
    navigate("/login");
  };

  return (
    <div className="max-w-[1170px] mx-auto px-4 py-8 md:py-16 font-sans text-slate-900 dark:text-zinc-100 transition-colors">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 text-sm text-gray-500 dark:text-zinc-400">
        <div>
          <span className="hover:text-black dark:hover:text-white cursor-pointer transition-colors" onClick={() => navigate("/home")}>Home</span>
          <span className="mx-2">/</span>
          <span className="text-black dark:text-white font-semibold">My Account</span>
        </div>
        <div className="text-slate-900 dark:text-zinc-300">
          Welcome! <span className="text-[#DB4444] dark:text-red-400 font-bold">{firstName} {lastName}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Manage My Account</h2>
          <ul className="space-y-3 pl-4 mb-8">
            <li className="text-[#DB4444] dark:text-red-400 font-medium cursor-pointer">My Profile</li>
            <li className="text-gray-600 dark:text-zinc-400 hover:text-[#DB4444] dark:hover:text-red-400 cursor-pointer transition-colors">Address Book</li>
            <li className="text-gray-600 dark:text-zinc-400 hover:text-[#DB4444] dark:hover:text-red-400 cursor-pointer transition-colors">My Payment Options</li>
          </ul>

          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">My Orders</h2>
          <ul className="space-y-3 pl-4 mb-8">
            <li className="text-gray-600 dark:text-zinc-400 hover:text-[#DB4444] dark:hover:text-red-400 cursor-pointer transition-colors">My Returns</li>
            <li className="text-gray-600 dark:text-zinc-400 hover:text-[#DB4444] dark:hover:text-red-400 cursor-pointer transition-colors">My Cancellations</li>
          </ul>

          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Actions</h2>
          <ul className="space-y-3 pl-4">
            <li onClick={handleLogout} className="text-red-600 dark:text-red-400 font-semibold hover:underline cursor-pointer transition-colors">
              Logout Account
            </li>
          </ul>
        </div>

        <div className="md:col-span-3 bg-white dark:bg-zinc-900 p-6 md:p-8 rounded-lg border border-gray-200 dark:border-zinc-800 shadow-sm transition-colors">
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-8 mb-8 border-b border-gray-100 dark:border-zinc-800">
            <img
              src={avatar || "https://avatars.githubusercontent.com/u/20927864"}
              alt="Avatar"
              className="w-24 h-24 rounded-full object-cover border-4 border-gray-100 dark:border-zinc-800 shadow-sm"
            />
            <div className="text-center sm:text-left">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{firstName} {lastName}</h1>
              <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">{job || "Exclusive Member"}</p>
              <div className="mt-2 flex flex-wrap gap-2 justify-center sm:justify-start">
                <span className="px-3 py-1 bg-red-50 dark:bg-red-950/30 text-[#DB4444] dark:text-red-400 text-xs font-semibold rounded-full">
                  ID: {parsedUser?.id || "N/A"}
                </span>
                <span className="px-3 py-1 bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-300 text-xs font-semibold rounded-full">
                  Active User
                </span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSave}>
            <h2 className="text-xl font-bold text-[#DB4444] dark:text-red-400 mb-6">Edit Your Profile</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-zinc-300 mb-2">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-[#DB4444] dark:focus:border-red-400 focus:bg-white dark:focus:bg-zinc-900 text-slate-900 dark:text-zinc-100 transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-zinc-300 mb-2">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-[#DB4444] dark:focus:border-red-400 focus:bg-white dark:focus:bg-zinc-900 text-slate-900 dark:text-zinc-100 transition-colors"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-zinc-300 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-[#DB4444] dark:focus:border-red-400 focus:bg-white dark:focus:bg-zinc-900 text-slate-900 dark:text-zinc-100 transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-zinc-300 mb-2">Phone Number</label>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-[#DB4444] dark:focus:border-red-400 focus:bg-white dark:focus:bg-zinc-900 text-slate-900 dark:text-zinc-100 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-zinc-300 mb-2">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-[#DB4444] dark:focus:border-red-400 focus:bg-white dark:focus:bg-zinc-900 text-slate-900 dark:text-zinc-100 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-zinc-300 mb-2">Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-[#DB4444] dark:focus:border-red-400 focus:bg-white dark:focus:bg-zinc-900 text-slate-900 dark:text-zinc-100 transition-colors"
                />
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-sm font-semibold text-slate-700 dark:text-zinc-300 mb-2">Job Designation / Role</label>
              <input
                type="text"
                value={job}
                onChange={(e) => setJob(e.target.value)}
                className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-[#DB4444] dark:focus:border-red-400 focus:bg-white dark:focus:bg-zinc-900 text-slate-900 dark:text-zinc-100 transition-colors"
              />
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate("/home")}
                className="px-6 py-2.5 border border-gray-300 dark:border-zinc-700 rounded text-sm font-semibold text-slate-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer w-full sm:w-auto"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-8 py-2.5 bg-[#DB4444] dark:bg-red-600 text-white rounded text-sm font-semibold hover:bg-[#c33d3d] dark:hover:bg-red-700 transition-colors cursor-pointer w-full sm:w-auto"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>

      <Dialog
        isOpen={dialog.isOpen}
        title={dialog.title}
        message={dialog.message}
        type={dialog.type}
        onClose={() => setDialog((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
