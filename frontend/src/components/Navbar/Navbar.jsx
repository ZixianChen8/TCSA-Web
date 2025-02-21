import styles from "./Navbar.module.css"
const Navbar = () => {
    
    
    return (
        <nav className={styles.navbar}>
        <div className={styles.logo}>
          <a href="/">TCSA</a>
        </div>
        <ul className={styles.navLinks}>
          <li>
            <a href="/events">Events</a>
          </li>
          <li>
            <a href="#">Resources</a>
          </li>
          <li>
            <a href="/joinus">Join us</a>
          </li>
          <li>
            <a href="/ourteam">Our Teams</a>
          </li>
        </ul>
      </nav>
    );
};

export default Navbar;