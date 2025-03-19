export default function Spinner() {
    return (
      <>
        <div className="flex flex-col justify-center items-center pt-64">
          <div className="flex items-center justify-center">
            <span className="loading loading-infinity loading-lg"></span>
          </div>
          <p className="font-light text-xs">LOADING</p>
        </div>
      </>
    );
}