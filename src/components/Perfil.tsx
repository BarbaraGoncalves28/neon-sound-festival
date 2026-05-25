import { useEffect, useState } from "react";
import { User, Mail, Lock, Bell, Camera, Eye, EyeOff } from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";

export default function Perfil() {
  const { user, updateUser } = useAuth();
  const [avatar, setAvatar] = useState<string | null>(user?.avatarUrl ?? null);
  const [imageError, setImageError] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [notifications, setNotifications] = useState(true);

  useEffect(() => {
  setImageError(false);
}, [avatar]);

  //

  const handleProfileUpdate = () => {
    if(!name || !email) {
      toast.error("Preencha nome e email");
      return;
    }

    updateUser(name, email);

    toast.success("Perfil atualizado");
  }

   // Validação senha forte
  const validatePassword = (password: string) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    return regex.test(password);
  };

  // Atualizar senha
  const handlePasswordUpdate = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Preencha todos os campos");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }

    if (!validatePassword(newPassword)) {
      toast.error(
        "Senha fraca. Use 8+ caracteres, maiúscula, número e símbolo."
      );
      return;
    }

    toast.success("Senha atualizada com sucesso!");

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  //

  const handleNotificationToggle = () => {
    const newValue = !notifications;
    setNotifications(newValue);

    if(newValue) {
      toast.success("Você receberá novidades do festival por email!");
    } else {
      toast.error("Notificações por email desativadas!", {
      icon: "🔕",
      });
    }
  };

  // 

  const handleConnectSocial = () => {
    toast("Conectando conta...", {
      icon: "🔗",
    });

    setTimeout(() => {
      toast.success("Conta conectada com sucesso!");     
    }, 1500);
  };

  //

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onloadend = () => {
    const base64Image = reader.result as string;

    setAvatar(base64Image);

    updateUser(name, email, base64Image);

    toast.success("Foto de perfil atualizada!");
  };

  reader.readAsDataURL(file);
};

  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto space-y-10">

        {/* HEADER */}
<div className="flex items-center gap-6 ">
  <div className="relative">

    <div className="w-24 h-24 rounded-full border border-purple-500 
    shadow-[0_0_12px_rgba(168,85,247,0.8)] overflow-hidden flex items-center justify-center">

      {avatar && !imageError ? (
  <img
    src={avatar}
    alt="Avatar"
    className="w-full h-full object-cover"
    onError={() => setImageError(true)}
  />
) : (
  <User size={40} className="text-purple-400" />
)}

    </div>

    {/* input escondido */}
    <input
      type="file"
      accept="image/*"
      onChange={handleAvatarChange}
      className="hidden"
      id="avatarUpload"
    />

    {/* botão câmera */}
    <label
      htmlFor="avatarUpload"
      className="absolute bottom-0 right-0 bg-purple-600 p-2 rounded-full hover:bg-purple-700 transition cursor-pointer"
    >
      <Camera size={16} />
    </label>

  </div>

  <div>
    <h2 className="text-3xl md:text-4xl font-bold neon-text">
      Meu Perfil
  </h2>
    <p className="text-gray-400">
      Gerencie suas informações e configurações da conta
    </p>
  </div>
</div>

        {/* INFORMAÇÕES PESSOAIS */}
        <div className="border border-purple-500/40 rounded-xl p-6 bg-black/40 backdrop-blur-md">
          <h2 className="text-xl md:text-2xl font-bold neon-text mb-5">
      Informações Pessoais
  </h2>

          <div className="grid md:grid-cols-2 gap-6">

            {/* Nome */}
            <div>
              <label className="text-sm text-gray-400 flex items-center gap-2 mb-2 neon-text">
                <User size={16} /> Nome
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-black border border-purple-500/40 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500 capitalize"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-sm text-gray-400 flex items-center gap-2 mb-2 neon-text">
                <Mail size={16} /> Email
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black border border-purple-500/40 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <button onClick={handleProfileUpdate} className="mt-6 px-6 py-2 rounded-full border border-purple-500
          shadow-[0_0_8px_rgba(168,85,247,0.7)]
          hover:shadow-[0_0_16px_rgba(168,85,247,0.9)]
          transition cursor-pointer">
            Salvar alterações
          </button>
        </div>

        {/* SEGURANÇA */}
        <div className="border border-purple-500/40 rounded-xl p-6 bg-black/40 backdrop-blur-md">
          <h2 className="text-xl md:text-2xl font-bold neon-text mb-5">
      Segurança
  </h2>

          <div className="grid md:grid-cols-3 gap-6">

            {/* Senha atual */}
            <div>
              <label className="text-sm text-gray-400 flex items-center gap-2 mb-2 neon-text">
                <Lock size={16} /> Senha atual
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) =>
                    setCurrentPassword(e.target.value)
                  }
                  className="w-full bg-black border border-purple-500/40
                  rounded-lg px-4 py-2 pr-10 focus:outline-none focus:border-purple-500"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-white"
                >
                  {showPassword ? (
                    <Eye size={18} />
                  ) : (
                    <EyeOff size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Nova senha */}
            <div>
              <label className="text-sm text-gray-400 flex items-center gap-2 mb-2 neon-text">
                <Lock size={16} /> Nova senha
              </label>

              <input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) =>
                  setNewPassword(e.target.value)
                }
                className="w-full bg-black border border-purple-500/40
                rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Confirmar senha */}
            <div>
              <label className="text-sm text-gray-400 flex items-center gap-2 mb-2 neon-text">
                <Lock size={16} /> Confirmar senha
              </label>

              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                className="w-full bg-black border border-purple-500/40
                rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
              />
            </div>

          </div>

          <button
            onClick={handlePasswordUpdate}
            className="mt-6 px-6 py-2 rounded-full border border-purple-500
            shadow-[0_0_8px_rgba(168,85,247,0.7)]
            hover:shadow-[0_0_16px_rgba(168,85,247,0.9)]
            transition cursor-pointer"
          >
            Atualizar senha
          </button>
        </div>

        {/* CONFIGURAÇÕES DA CONTA */}
        <div className="border border-purple-500/40 rounded-xl p-6 bg-black/40 backdrop-blur-md">
          <h2 className="text-xl md:text-2xl font-bold neon-text mb-5">
      Configurações da Conta
  </h2>

          <div className="space-y-6">

            {/* Notificações */}
            <div className="flex items-center justify-between border-b border-purple-500/20 pb-4">
              <div className="flex items-center gap-3">
                <Bell className="text-purple-400" />
                <div>
                  <p className="neon-text font-medium">Notificações</p>
                  <p className="text-sm text-gray-400">
                    Receber novidades por email
                  </p>
                </div>
              </div>

              <input
                type="checkbox"
                checked={notifications}
                onChange={handleNotificationToggle}
                className="w-5 h-5 accent-purple-500"
              />
            </div>

            {/* Redes sociais */}
            <div className="flex items-center justify-between">
              <div>
                <p className="neon-text font-medium">Conectar redes sociais</p>
                <p className="text-sm text-gray-400">
                  Conecte sua conta com Google ou outras redes
                </p>
              </div>

              <button onClick={handleConnectSocial} className="px-4 py-2 border border-purple-500 rounded-full        
            shadow-[0_0_8px_rgba(168,85,247,0.7)]
            hover:shadow-[0_0_16px_rgba(168,85,247,0.9)]
            transition cursor-pointer">
                Conectar
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}