import styles from "./Navbar.module.css"
const Navbar = () => {
    
    
    return (
        <nav className={styles.navbar}>
        <div className={styles.logo}>TCSA LOGO</div>
        <ul className={styles.navLinks}>
          <li>
            <a href="#">Events</a>
          </li>
          <li>
            <a href="#">Resources</a>
          </li>
          <li>
            <a href="#">Join us</a>
          </li>
          <li>
            <a href="#">Our Teams</a>
          </li>
        </ul>
      </nav>
    );
};

export default Navbar;