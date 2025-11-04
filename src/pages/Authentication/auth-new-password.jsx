// /* eslint-disable no-unused-vars */
// "use client"

// import { useEffect, useState } from "react"
// import { Form, Input, Button, Card, Typography, Alert } from "antd"
// import { LockOutlined, EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons"

// import logoImg from "../../assets/images/logo-light.png"
// import contactImg from "../../assets/images/contact.svg"

// import riafcoAbout from "../../assets/images/riafco-about-2.jpg";
// import riafcoAbout1 from "../../assets/images/riafco-about-1.jpg";
// import { Link, useLocation, useNavigate } from "react-router-dom"
// import Switcher from "../../components/switcher"
// import BackButton from "../../components/backButton"
// import authService from "../../services/authService"

// const { Title, Text } = Typography

// export default function AuthNewPassword() {
//     const [form] = Form.useForm()
//     const [isLoading, setIsLoading] = useState(false)
//     const [error, setError] = useState("")
//     const [success, setSuccess] = useState(false)

//     const location = useLocation()
//     const searchParams = new URLSearchParams(location.search)
//     const token = searchParams.get("token")
//     console.log(token)
//     const navigate = useNavigate()


//     useEffect(() => {
//         if (!token) {
//             navigate("/auth/login")
//         }
//     }, [token, navigate])

//     const validatePassword = (_, value) => {
//         if (!value) {
//             return Promise.reject(new Error("Le mot de passe est requis"))
//         }
//         if (value.length < 8) {
//             return Promise.reject(new Error("Le mot de passe doit contenir au moins 8 caractères"))
//         }
//         if (!/(?=.*[a-z])/.test(value)) {
//             return Promise.reject(new Error("Le mot de passe doit contenir au moins une lettre minuscule"))
//         }
//         if (!/(?=.*[A-Z])/.test(value)) {
//             return Promise.reject(new Error("Le mot de passe doit contenir au moins une lettre majuscule"))
//         }
//         if (!/(?=.*\d)/.test(value)) {
//             return Promise.reject(new Error("Le mot de passe doit contenir au moins un chiffre"))
//         }
//         return Promise.resolve()
//     }

//     const validateConfirmPassword = (_, value) => {
//         if (!value) {
//             return Promise.reject(new Error("Veuillez confirmer votre mot de passe"))
//         }
//         if (value !== form.getFieldValue("newPassword")) {
//             return Promise.reject(new Error("Les mots de passe ne correspondent pas"))
//         }
//         return Promise.resolve()
//     }

//     const handleResetPassword = async (values) => {
//         if (!token) return

//         setIsLoading(true)
//         setError("")

//         const body = {
//             token,
//             newPassword: values.newPassword,
//         }
//         console.log(body)
//         try {
//             await authService.resetPassword(body)
//             setSuccess(true)
//             setTimeout(() => {
//                 navigate("/auth/login")
//             }, 2000)
//         } catch (err) {
//             console.error("Erreur lors de la réinitialisation:", err)
//             setError(err.response?.data?.message || "Erreur lors de la réinitialisation du mot de passe. Veuillez réessayer.")
//         } finally {
//             setIsLoading(false)
//         }
//     }

//     if (!token) {
//         return null
//     }

//     if (success) {
//         return (
//             <div className="min-h-screen flex items-center justify-center bg-gray-50">
//                 <Card className="w-full max-w-md">
//                     <div className="text-center">
//                         <div className="mb-4">
//                             <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                                 <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                                 </svg>
//                             </div>
//                         </div>
//                         <Title level={3} className="text-green-600">
//                             Mot de passe modifié !
//                         </Title>
//                         <Text className="text-gray-600">
//                             Votre mot de passe a été modifié avec succès. Vous allez être redirigé vers la page de connexion.
//                         </Text>
//                     </div>
//                 </Card>
//             </div>
//         )
//     }

//     return (
//         <>
//             <section className="relative overflow-hidden">
//                 <div className="absolute inset-0 bg-[var(--riafco-blue)]/[0.02]"></div>
//                 <div className="container-fluid relative">
//                     <div className="md:flex items-center">
                        
//                         <div className="xl:w-[50%] lg:w-1/2 md:w-1/2">
//                             <div className="relative md:flex flex-col md:min-h-screen justify-center bg-white dark:bg-slate-900 shadow-sm dark:shadow-gray-700 md:px-10 py-10 px-4 z-1">
//                                 <div className="text-center">
//                                     <Link href="/">
//                                         <img src={logoImg} className="mx-auto h-26" alt="RIAFCO Logo" />
//                                     </Link>
//                                 </div>

//                                 <div className="title-heading text-center md:my-auto my-20">
//                                     <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//                                         <Card className="w-full max-w-md">
//                                             <div className="text-center mb-8">
//                                                 <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                                                     <LockOutlined className="text-2xl text-blue-600" />
//                                                 </div>
//                                                 <Title level={2}>Nouveau mot de passe</Title>
//                                                 <Text className="text-gray-600">Veuillez saisir votre nouveau mot de passe</Text>
//                                             </div>

//                                             {error && <Alert message={error} type="error" showIcon className="mb-6" />}

//                                             <Form
//                                                 form={form}
//                                                 name="resetPassword"
//                                                 onFinish={handleResetPassword}
//                                                 layout="vertical"
//                                                 size="large"
//                                             >
//                                                 <Form.Item
//                                                     name="newPassword"
//                                                     label="Nouveau mot de passe"
//                                                     rules={[{ validator: validatePassword }]}
//                                                 >
//                                                     <Input.Password
//                                                         prefix={<LockOutlined />}
//                                                         placeholder="Saisissez votre nouveau mot de passe"
//                                                         iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
//                                                     />
//                                                 </Form.Item>

//                                                 <Form.Item
//                                                     name="confirmPassword"
//                                                     label="Confirmer le mot de passe"
//                                                     rules={[{ validator: validateConfirmPassword }]}
//                                                 >
//                                                     <Input.Password
//                                                         prefix={<LockOutlined />}
//                                                         placeholder="Confirmez votre nouveau mot de passe"
//                                                         iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
//                                                     />
//                                                 </Form.Item>

//                                                 <Form.Item>
//                                                     <Button type="primary" htmlType="submit" loading={isLoading} block size="large">
//                                                         {isLoading ? "Modification en cours..." : "Modifier le mot de passe"}
//                                                     </Button>
//                                                 </Form.Item>
//                                             </Form>

//                                             <div className="text-center">
//                                                 <Text className="text-gray-500">
//                                                     Vous vous souvenez de votre mot de passe ?{" "}
//                                                     <Button type="link" onClick={() => navigate("/auth/login")} className="p-0">
//                                                         Se connecter
//                                                     </Button>
//                                                 </Text>
//                                             </div>
//                                         </Card>
//                                     </div>
//                                 </div>
//                                 <div className="text-center">
//                                     <p className="mb-0 text-slate-400">
//                                         © {new Date().getFullYear()} RIAFCO <i className="mdi mdi-heart text-red-600"></i> by{" "}
//                                         <Link href="https://alhussein-khouma.vercel.app/" target="_blank" className="text-reset">
//                                             ADM
//                                         </Link>
//                                         .
//                                     </p>
//                                 </div>
//                             </div>
//                         </div>

//                         <div className="xl:w-[50%] lg:w-1/2 md:w-1/2 flex justify-center mx-6 md:my-auto my-20">
//                             <div>
//                                 <div className="relative">
//                                     <div className="absolute top-20 start-20 bg-[var(--riafco-blue)]/[0.02] size-[1200px] rounded-full"></div>
//                                     <div className="absolute bottom-20 -end-20 bg-[var(--riafco-blue)]/[0.02] size-[600px] rounded-full"></div>
//                                 </div>

//                                 <div className="text-center">
//                                     <div>
//                                         <img
//                                             src={riafcoAbout1}
//                                             className="max-w-xl mx-auto"
//                                             alt="Contact"
//                                         />
//                                         <div className="relative max-w-xl mx-auto text-start">
//                                             <div
//                                                 className="relative p-8 border-2 border-[var(--riafco-blue)] rounded-[30px] before:content-[''] before:absolute before:w-28 before:border-[6px]
//                                              before:border-white dark:before:border-slate-900 before:-bottom-1 before:start-16 before:z-2 after:content-['']
//                                               after:absolute after:border-2 after:border-[var(--riafco-blue)] after:rounded-none after:rounded-e-[50px] after:w-20 after:h-20 after:-bottom-[80px] after:start-[60px] after:z-3 after:border-s-0 after:border-b-0"
//                                             >
//                                                 <span className="font-semibold leading-normal">
//                                                     RIAFCO | Réseau des Institutions Africaines de Financement des Collectivités locales
//                                                 </span>

//                                                 <div className="absolute text-8xl -top-0 start-4 text-[var(--riafco-blue)]/10 dark:text-[var(--riafco-blue)]/20 -z-1">
//                                                     <i className="mdi mdi-format-quote-open"></i>
//                                                 </div>
//                                             </div>

//                                             <div className="text-lg font-semibold mt-6 ms-44  text-[var(--riafco-blue)] ">- RIAFCO</div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </section>
//             <Switcher />
//             <BackButton />
//         </>
//     )
// }

/* eslint-disable no-unused-vars */
"use client"

import { useEffect, useState } from "react";
import { Form, Input, Button, Card, Typography, Alert } from "antd";
import { LockOutlined, EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { Link, useLocation, useNavigate } from "react-router-dom";

import logoImg from "../../assets/images/logo-light.png";
import riafcoAbout1 from "../../assets/images/riafco-about-1.jpg";

import Switcher from "../../components/switcher";
import BackButton from "../../components/backButton";
import authService from "../../services/authService";

const { Title, Text } = Typography;

export default function AuthNewPassword() {
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get("token");
    const navigate = useNavigate();

    useEffect(() => {
        const htmlTag = document.documentElement;
        htmlTag.setAttribute("dir", "ltr");
        htmlTag.classList.add("light");
        htmlTag.classList.remove("dark");
    }, []);

    useEffect(() => {
        if (!token) navigate("/auth/login");
    }, [token, navigate]);

    const validatePassword = (_, value) => {
        if (!value) return Promise.reject(new Error("Le mot de passe est requis"));
        if (value.length < 8) return Promise.reject(new Error("Le mot de passe doit contenir au moins 8 caractères"));
        if (!/(?=.*[a-z])/.test(value)) return Promise.reject(new Error("Le mot de passe doit contenir au moins une lettre minuscule"));
        if (!/(?=.*[A-Z])/.test(value)) return Promise.reject(new Error("Le mot de passe doit contenir au moins une lettre majuscule"));
        if (!/(?=.*\d)/.test(value)) return Promise.reject(new Error("Le mot de passe doit contenir au moins un chiffre"));
        return Promise.resolve();
    };

    const validateConfirmPassword = (_, value) => {
        if (!value) return Promise.reject(new Error("Veuillez confirmer votre mot de passe"));
        if (value !== form.getFieldValue("newPassword")) return Promise.reject(new Error("Les mots de passe ne correspondent pas"));
        return Promise.resolve();
    };

    const handleResetPassword = async (values) => {
        if (!token) return;
        setIsLoading(true);
        setError("");

        try {
            await authService.resetPassword({ token, newPassword: values.newPassword });
            setSuccess(true);
            setTimeout(() => navigate("/auth/login"), 2000);
        } catch (err) {
            console.error("Erreur lors de la réinitialisation:", err);
            setError(
                err?.response?.data?.message ||
                "Erreur lors de la réinitialisation du mot de passe. Veuillez réessayer."
            );
        } finally {
            setIsLoading(false);
        }
    };

    if (!token) return null;

    // Écran de succès (même fond + carte centrée)
    if (success) {
        return (
            <>
                <section
                    className="md:h-screen py-36 flex items-center relative bg-no-repeat bg-center bg-cover"
                    style={{ backgroundImage: `url(${riafcoAbout1})` }}
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70" />
                    <div className="container relative">
                        <div className="flex justify-center">
                            <Card className="w-full max-w-md">
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <Title level={3} className="!text-green-600">Mot de passe modifié !</Title>
                                    <Text className="text-gray-600">
                                        Vous allez être redirigé vers la page de connexion.
                                    </Text>
                                </div>
                            </Card>
                        </div>
                    </div>
                </section>
                <Switcher />
                <BackButton />
            </>
        );
    }

    return (
        <>
            {/* Fond plein écran + overlay, carte centrée */}
            <section
                className="md:h-screen py-36 flex items-center relative bg-no-repeat bg-center bg-cover"
                style={{ backgroundImage: `url(${riafcoAbout1})` }}
            >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70" />

                <div className="container relative">
                    <div className="flex justify-center">
                        <div className="max-w-[460px] w-full m-auto p-6 bg-white dark:bg-slate-900 shadow-md dark:shadow-gray-800 rounded-md">
                            <div className="text-center">
                                <Link to="/">
                                    <img src={logoImg} className="mx-auto h-20" alt="RIAFCO Logo" />
                                </Link>
                            </div>

                            <div className="text-center my-6">
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <LockOutlined className="text-2xl text-blue-600" />
                                </div>
                                <Title level={3} className="!mb-1">Nouveau mot de passe</Title>
                                <Text className="text-gray-600">Veuillez saisir votre nouveau mot de passe</Text>
                            </div>

                            {error && <Alert message={error} type="error" showIcon className="mb-4" />}

                            <Form
                                form={form}
                                name="resetPassword"
                                onFinish={handleResetPassword}
                                layout="vertical"
                                size="large"
                            >
                                <Form.Item
                                    name="newPassword"
                                    label="Nouveau mot de passe"
                                    rules={[{ validator: validatePassword }]}
                                >
                                    <Input.Password
                                        prefix={<LockOutlined />}
                                        placeholder="Saisissez votre nouveau mot de passe"
                                        iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="confirmPassword"
                                    label="Confirmer le mot de passe"
                                    rules={[{ validator: validateConfirmPassword }]}
                                >
                                    <Input.Password
                                        prefix={<LockOutlined />}
                                        placeholder="Confirmez votre nouveau mot de passe"
                                        iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                    />
                                </Form.Item>

                                <Form.Item>
                                    <Button type="primary" htmlType="submit" loading={isLoading} block size="large">
                                        {isLoading ? "Modification en cours..." : "Modifier le mot de passe"}
                                    </Button>
                                </Form.Item>
                            </Form>

                            <div className="text-center">
                                <Text className="text-gray-500">
                                    Vous vous souvenez de votre mot de passe ?{" "}
                                    <Button type="link" onClick={() => navigate("/auth/login")} className="p-0">
                                        Se connecter
                                    </Button>
                                </Text>
                            </div>

                            <div className="text-center mt-6">
                                <p className="mb-0 text-slate-400 text-sm">
                                    © {new Date().getFullYear()} RIAFCO. Réalisé avec ❤️ par{" "}
                                    <Link to="https://alhussein-khouma.vercel.app/" target="_blank" className="text-[var(--riafco-blue)] hover:underline">
                                        ADM
                                    </Link>.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Switcher />
            <BackButton />
        </>
    );
}
