export default function Footer(props) {
  return (
    <>
      <footer className="footer footer-center bg-base-200 text-base-content p-4">
        <aside>
          <p>
            Copyright © {new Date().getFullYear()} - All right reserved by
            Uranium Glass Ltd
          </p>
        </aside>
      </footer>
    </>
  );
}
