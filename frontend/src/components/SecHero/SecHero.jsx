import Btn1 from "../Btn1/Btn1.jsx"
import styles from "./SecHero.module.css"

const SecHero = ({title, message, showBtn, btnText, btnLink}) => {

    //If showBtn is true then display a button
    let btn = null;
    if (showBtn) {
        btn = (
            <Btn1 
            href={btnLink} 
            variant="primary" 
            size="lg"
            >
                {btnText}
            </Btn1>
        );
    }

    return (
        <section className={styles.hero}>
            <div className={styles.heroContent}>
                <h1>{title}</h1>
                <p className={styles.welcomeMessage}>{message}</p>
                <div className={styles.btnContainer}>
                    {btn}
                </div>
            </div>
        </section>
    )
};

export default SecHero;