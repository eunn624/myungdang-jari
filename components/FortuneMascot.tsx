import styles from '../styles/AppFlow.module.css';

interface FortuneMascotProps {
  size?: 'sm' | 'md' | 'lg';
  mood?: 'purple' | 'yellow' | 'blue' | 'sunset';
  badge?: string;
}

export default function FortuneMascot({
  size = 'md',
  mood = 'purple',
  badge,
}: FortuneMascotProps) {
  const sizeClass = size === 'sm'
    ? styles.mascotShellSm
    : size === 'lg'
      ? styles.mascotShellLg
      : styles.mascotShellMd;

  const moodClass = mood === 'yellow'
    ? styles.mascotMoodYellow
    : mood === 'blue'
      ? styles.mascotMoodBlue
      : mood === 'sunset'
        ? styles.mascotMoodSunset
        : styles.mascotMoodPurple;

  return (
    <div className={`${styles.mascotShell} ${sizeClass} ${moodClass}`}>
      <div className={styles.mascotSparkleA}>✦</div>
      <div className={styles.mascotSparkleB}>✦</div>
      {badge ? <div className={styles.mascotBubble}>{badge}</div> : null}
      <div className={styles.mascotBlob}>
        <div className={styles.mascotEyeRow}>
          <span className={styles.mascotEye}></span>
          <span className={styles.mascotEye}></span>
        </div>
        <div className={styles.mascotBeak}></div>
        <div className={styles.mascotCheekLeft}></div>
        <div className={styles.mascotCheekRight}></div>
        <div className={styles.mascotFootRow}>
          <span className={styles.mascotFoot}></span>
          <span className={styles.mascotFoot}></span>
        </div>
      </div>
    </div>
  );
}
