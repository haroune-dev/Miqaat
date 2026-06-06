import { useEffect } from "react";
import { useNavigate } from "react-router";

export default function LocationSelection() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/settings#location", { replace: true });
  }, [navigate]);

  return null;
}
