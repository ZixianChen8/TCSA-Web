import Btn1 from "../Btn1/Btn1.jsx"
import styles from "./SecHero.module.css"

const SecHero = ({title, message, showBtn, btnText, btnLink}) => {

    let displayTitle;
    if (title == "TERFER CHINESE STUDENT ASSOCIATION") {
        let words = title.split(" ");
        let firstWord = words.shift();
        let rest = words.join(" ");

        displayTitle = firstWord + "\n" + rest;
    } else {
        displayTitle = title;
    }

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
                <h1>{displayTitle}</h1>
                <p className={styles.welcomeMessage}>{message}</p>
                <div className={styles.btnContainer}>
                    {btn}
                </div>
            </div>
        </section>
    )
};

export default SecHero;