import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();

  const goBack = () => navigate(-1);

  return (
    <div id="unauthorized-page">
      <h1>Unauthorized</h1>
      <p>You do not have access to the requested page.</p>
      <div>
        <button onClick={goBack}>Go Back</button>
      </div>
    </div>
  );
};

export default Unauthorized;
