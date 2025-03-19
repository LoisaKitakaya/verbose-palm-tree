export default function Footer(props) {
  return (
    <>
      <footer className="footer sm:footer-horizontal bg-base-100 text-base-content p-10 border-t border-gray-200">
        <aside>
          <a
            href="/"
            className="text-3xl text-green-400"
            style={{
              "font-family": "'Germania One', system-ui",
              "font-weight": 400,
              "font-style": "normal",
            }}
          >
            Uranium Glass
          </a>
          <p>
            Uranium Glass Auctions Ltd.
            <br />
            Providing reliable glass auctions since a while back...
          </p>
        </aside>
        <nav>
          <h6 className="footer-title">Services</h6>
          <a className="link link-hover">Branding</a>
          <a className="link link-hover">Design</a>
          <a className="link link-hover">Marketing</a>
          <a className="link link-hover">Advertisement</a>
        </nav>
        <nav>
          <h6 className="footer-title">Company</h6>
          <a className="link link-hover">About us</a>
          <a className="link link-hover">Contact</a>
          <a className="link link-hover">Jobs</a>
          <a className="link link-hover">Press kit</a>
        </nav>
        <nav>
          <h6 className="footer-title">Legal</h6>
          <a className="link link-hover">Terms of use</a>
          <a className="link link-hover">Privacy policy</a>
          <a className="link link-hover">Cookie policy</a>
        </nav>
      </footer>
    </>
  );
}
