 export const Loader = ({ message }: { message: string }) => (
    <div className="e-loadholder">
      <div className="m-loader">
        <span className="e-text">{message}</span>
      </div>
    </div>
  );