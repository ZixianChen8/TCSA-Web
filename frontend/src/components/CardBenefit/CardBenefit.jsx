import { useRef } from "react";
import styles from "./CardBenefit.module.css";

const CardBenefit = ({ children, className = "", spotlightColor = "rgba(255, 255, 255, 0.25)", icon, title, description }) => {
  const divRef = useRef(null);

  const handleMouseMove = (e) => {
    const rect = divRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    divRef.current.style.setProperty("--mouse-x", `${x}px`);
    divRef.current.style.setProperty("--mouse-y", `${y}px`);
    divRef.current.style.setProperty("--spotlight-color", spotlightColor);
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      className={`${styles.cardSpotlight} ${className}`}
    >
      {icon && <div className={styles.icon}>{icon}</div>}
      {title && <div className={styles.benefitTitle}>{title}</div>}
      {description && <div className={styles.benefitDescription}>{description}</div>}
      {children}
    </div>
  );
};

export default CardBenefit;
