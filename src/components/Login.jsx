import { useState } from "react";
import bg from "../assets/images/bg.png";
import LoginForm from "./login/LoginForm";
import RegisterForm from "./login/RegisterForm";

function Login() {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => setIsLogin(!isLogin);

  return (
    <section>
      <div className="grid md:h-screen md:grid-cols-2">
        <img src={bg} className="absolute z-[999] pointer-events-none" alt="" />
        <div className="flex flex-col items-center justify-center bg-white backdrop-blur-lg">
          <div className="order-2 max-w-lg px-5 py-16 text-center md:px-10 md:py-24 lg:py-32">
            <h2 className="mb-8 text-2xl font-bold md:mb-12 md:text-4xl">
              JHCSC Online Clearance Made Easy – Get Started
            </h2>
            {isLogin ? (
              <LoginForm onToggle={toggleForm} />
            ) : (
              <RegisterForm onToggle={toggleForm} />
            )}
          </div>
        </div>

        <div className="order-1 flex flex-col items-center justify-center bg-gray-200/85 backdrop-blur">
          <div className="max-w-lg px-5 py-16 md:px-10 md:py-24 lg:py-32">
            <div className="mb-6 ml-2 flex h-14 w-14 items-center justify-center bg-green-700 [box-shadow:#15803d_-8px_8px]">
              <img
                src="https://upload.wikimedia.org/wikipedia/en/c/c0/JH_Cerilles_State_College_logo.jpg"
                alt=""
                className="inline-block"
              />
            </div>
            <p className="mb-8 text-[#647084] md:mb-4 lg:mb-8">
              <b className="text-red-600">J</b>ustice, Peace and Unity
              <br /> <b className="text-red-600">H</b>ope, Honesty and Humility{" "}
              <br /> <b className="text-red-600">C</b>redibility and Integrity <br /> <b className="text-red-600">S</b>ocial Responsibility and
              Interfaith Dialogue
              <br />
              <b className="text-red-600">C</b>ollaboration and Shared Competence
            </p>

            <p className="font-bold">JHCSC</p>
            <p className="text-sm">CORE VALUES</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;
