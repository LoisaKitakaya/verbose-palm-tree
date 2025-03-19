import { Show } from "solid-js";
import Footer from "./footer";
import Navbar from "./navbar";

export default function Container(props) {
  const show_navbar_2 = props.show_navbar_2 ? props.show_navbar_2 : false;

  return (
    <>
      <Navbar />

      <Show when={show_navbar_2}>
        <div className="navbar w-full bg-gray-100 px-4 shadow-2xs">
          <div className="navbar-center hidden lg:flex mx-auto">
            <ul className="menu menu-horizontal px-1">
              <li>
                <a href="/">Home</a>
              </li>
              <li>
                <a href="/blogs">Blogs</a>
              </li>
              <li>
                <a href="/faqs">FAQ's</a>
              </li>
              <li>
                <a href="/affiliate-program">Become An Affiliate</a>
              </li>
              <li>
                <a href="/contact-us">Contact Us</a>
              </li>
            </ul>
          </div>
        </div>
      </Show>

      <div className="min-h-screen py-2 px-4 mb-12">{props.children}</div>

      <Footer />
    </>
  );
}
