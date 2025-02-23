/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BounceLoader from "@/Components/BounchLoader";
import { useFetchQuery } from "@/hooks/useFetchQuery";

const ActivationPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [message, setMessage] = useState<string>("Activating your account...");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
    const { fetchRequest } = useFetchQuery();
  useEffect(() => {
    const activateAccount = async () => {
      try {
          setLoading(true);
        const activation:any = await fetchRequest(`user/activate/${token}`, "PUT", null);
          setMessage("Account activated successfully! Redirecting to login...");
        if (activation.success) navigate("/login");
       
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
       catch (err) {
        setError(
          "Activation failed. The token may have expired or is invalid."
        );
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      activateAccount();
    }
  }, [token, navigate]);
if(loading) return <BounceLoader/>
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      
      {error ? <p style={{ color: "red" }}>{error}</p> : <p>{message}</p>}
    </div>
  );
};

export default ActivationPage;
