import Footer from "./footer";
import Navbar from "./navbar";
import Drawer from "./drawer";

export default function Container(props) {
  return (
    <>
      <Navbar />

      <Drawer>
        <div className="min-h-screen p-4 bg-base-200 w-full">
          {props.children}
        </div>

        <Footer />
      </Drawer>
    </>
  );
}
