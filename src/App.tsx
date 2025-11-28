import './App.css'
import { useState } from "react";
import { motion } from "framer-motion";
import styles from './index.module.css'
import FormCard from './components/form-card/form-card';

function App() {
  const [expanded, setExpanded] = useState<number[]>([]);

  const expand = (id: number) => setExpanded(prev => [...prev, id]);
  const collapse = (id: number) => setExpanded(prev => prev.filter(p => p != id));
  const isExpanded = (id: number) => expanded.includes(id);

  return (
    <div className={styles['grid']}>
      {expanded.length < 2
        && <motion.div
          layout
          transition={{ type: 'spring', bounce: 0.4, duration: 1 }}
          className={`${styles['item']} ${styles['header']}`}
          style={{
            gridRow: '1',
            gridColumn: expanded.length > 0 ? "auto" : "1 / span 2"
          }}
        >
          <h2>{expanded.length == 0
            ? "Start by adding one service"
            : "Add another service for comparison"}</h2>
        </motion.div>
      }

      <motion.div
        layout
        transition={{ type: 'spring', bounce: 0.4, duration: 1 }}
        className={styles['item']}
        style={{
          gridRow: isExpanded(1) ? "1 / span 2" : "auto",
          gridColumn: expanded.length > 0 ? '1' : '1 / span 2'
        }}
      >
        {isExpanded(1)
          ? <FormCard onClose={() => collapse(1)} />
          : (
            <button onClick={() => expand(1)}>
              <svg className={styles['icon']} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                <path fill="currentColor" d="M11 13H5v-2h6V5h2v6h6v2h-6v6h-2z" />
              </svg>
            </button>
          )
        }
      </motion.div>

      {expanded.length > 0 && (
        <motion.div
          layout
          transition={{ type: 'spring', bounce: 0.4, duration: 0.8 }}
          className={styles['item']}
          style={{
            gridRow: isExpanded(2) ? "1 / span 2" : "auto",
            gridColumn: "2"
          }}
        >
          {isExpanded(2)
            ? <FormCard onClose={() => collapse(2)} />
            : (
              <button onClick={() => expand(2)}>
                <svg className={styles['icon']} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M11 13H5v-2h6V5h2v6h6v2h-6v6h-2z" />
                </svg>
              </button>
            )
          }
        </motion.div>
      )}
    </div>
  )
}

export default App
