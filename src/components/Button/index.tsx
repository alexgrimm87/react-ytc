import {FC} from "react";
import styles from "./index.module.scss";

const ButtonLink: FC = ({
  color,
  fontSize = 12,
  fontWeight= 500,
  textDecoration,
  children,
  ...buttonProps
}) => {
  return (
    <button
      {...buttonProps}
      className={styles.buttonLink}
      style={{
        color: `${color}`,
        fontSize: `${fontSize}px`,
        fontWeight: `${fontWeight}`,
        textDecoration: `${textDecoration}`
    }}>
      {children}
    </button>
  )
};

export default ButtonLink;
