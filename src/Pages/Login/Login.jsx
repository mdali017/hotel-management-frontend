import axios from "axios";
import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FetchUrls } from "../../Components/Common/FetchUrls";
import logo from "../../assets/Home page/logo1.png";
import orion_hotel_logo from "../../assets/hotel-orion-logo.png";
import PulseLoader from "react-spinners/PulseLoader";
const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await axios
        .post(FetchUrls("auth/login"), {
          email: data.email,
          password: data.password,
        })
        .then((res) => {
          // console.log(res.data)
          const user = {
            username: res.data.username,
            email: res.data.email,
            phone: res.data.phone,
            isAdmin: res.data.isAdmin,
          };
          // console.log(user)
          if (res.status === 200) {
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(user));

            Swal.fire({
              icon: "success",
              title: "Login Successfully",
              showConfirmButton: false,
              timer: 2000,
              timerProgressBar: true,
            }).then(() => {
              setLoading(false);
              navigate("/dashboard");
            });
          } else {
            setLoading(false);
            Swal.fire({
              icon: "error",
              title: "Login Failed",
              showConfirmButton: false,
              timer: 2000,
            });
          }
        });
    } catch (error) {
      setLoading(false);
      Swal.fire({
        icon: "error",
        title: `${error?.response?.data?.message}`,
        text: "Please Try Again!!!",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    }
  };
  return (
    <div>
      <section className="bg-gray-100 min-h-screen flex justify-center items-center text-secondary">
        <div className="bg-gray-200 grid grid-cols-1 md:grid-cols-2 w-[900px] gap-10 items-center rounded-2xl shadow-lg  md:p-20 p-5">
          <div className="md:w-full">
            <h2 className="font-bold text-2xl text-secondary">Login</h2>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-4 w"
            >
              <div>
                <input
                  className="p-4 rounded-xl border w-full  mt-10"
                  type="email"
                  name="email"
                  {...register("email", { required: true })}
                  placeholder="Email"
                />
                {errors.email && (
                  <span className="text-orange-600 text-sm">
                    Email is required
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  className="p-3 rounded-xl border w-full "
                  type="password"
                  name="password"
                  {...register("password", { required: true })}
                  placeholder="Password"
                />
                {errors.password && (
                  <span className="text-orange-600 text-sm">
                    Password is required
                  </span>
                )}
              </div>
              <div className="flex gap-5">
                <button
                  type="submit"
                  className="bg-accent bg-opacity-100 hover:bg-opacity-60 duration-300 rounded-xl text-white py-3 w-full"
                >
                  {loading ? (
                    <div className="flex justify-center gap-1">
                      <span>Loading</span>
                      <PulseLoader
                        className="mt-3"
                        color="#ffffff"
                        margin={2}
                        size={5}
                      />
                    </div>
                  ) : (
                    "Hotel Login"
                  )}
                </button>
                <a
                  href="http://respos.icicle.site"
                  target="_blank"
                  rel="noreferrer"
                  className="bg-secondary text-center cursor-pointer bg-opacity-100 hover:bg-opacity-60 duration-300 rounded-xl text-white py-3 w-full"
                >
                  Cafe & 4Q Login
                </a>
              </div>
            </form>

            <div className="flex justify-between mt-3">
              <div className="flex items-center justify-center gap-1 mt-3">
                <div className="text-sm">Login as an</div>
                <div className="text-md font-semibold text-accent tracking-tighter cursor-pointer hover:underline">
                  <a
                    href="https://backend.hotelorioninternational.com/login"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-pointer hover:underline"
                  >
                    Admin
                  </a>
                </div>
              </div>
              <div className="flex items-center justify-center gap-1 mt-3">
                <div className="text-sm">Log in to</div>
                <div className="text-md font-semibold text-accent tracking-tighter cursor-pointer hover:underline">
                  <a
                    href="https://hotelorioninternational.com:2096/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-pointer hover:underline"
                  >
                    Webmail
                  </a>
                </div>
              </div>
            </div>

            <p className="text-center text-xs border-b py-6">
              Forgot your password
            </p>
          </div>

          <div className="flex flex-col items-center justify-center space-y-">
            <div className="relative w-48 h-48 md:w-52 md:h-52">
              <img
                src={orion_hotel_logo}
                alt="Orion Hotel Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="text-center space-y-2">
              <h1 className="text-3xl md:text-4xl font-light tracking-wide text-secondary">
                Hotel Orion
                <span className="block text-2xl md:text-3xl text-accent mt-1">
                  International
                </span>
              </h1>
              <div className="w-16 h-0.5 bg-accent/60 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;
