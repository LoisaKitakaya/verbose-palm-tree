export default function LoggedInUser(props) {
  return (
    <>
      <div className="px-2 py-1 bg-info rounded hidden lg:block">
        <p className="font-semibold text-sm">USER'S NAME</p>
      </div>

      <div className="px-2 py-1 bg-info rounded lg:hidden">
        <p className="font-semibold text-sm">UN</p>
      </div>
    </>
  );
}
