import { useState, useEffect, useRef, ButtonHTMLAttributes } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image';
import CanvasDraw, { CanvasDrawProps } from "react-canvas-draw";
import styles from '../styles/Home.module.scss'


/**
 * Canvas was built by react-canvas-draw;
 * For keyboard actions I use "useUffect" hook for client-side window API;
 *  
 */
const Home: NextPage = () => {

  const activeCopy = useRef<HTMLButtonElement>(null)
  function showCopied() {
    console.log("showCopied", activeCopy.current);
    activeCopy.current?.focus()
    setTimeout(() => {
      activeCopy.current?.blur()
    }, 2000)
  }

  //*------------------------------------------ Canvas
  const signCanvas = useRef<CanvasDraw>(null);
  function clear() {
    signCanvas.current?.clear()
  }
  function undo() {
    console.log("undo");
    signCanvas.current?.undo()
  }
  async function save() {
    const src = (signCanvas.current as any).getDataURL()
    const blob = await (await fetch(src)).blob()
    const clipboardItem = new ClipboardItem({ [blob.type]: blob });
    navigator.clipboard.write([clipboardItem]);
    showCopied()
  }

  //*------------------------------------------ Canvas settings
  const [settings, setSettings] = useState<CanvasDrawProps>({
    brushColor: "#000000",
    lazyRadius: 3
  })
  function setBrushColor(brushColor: string) { setSettings(x => ({ ...x, brushColor })) }
  function setLazyRadius(lazyRadius: number) { setSettings(x => ({ ...x, lazyRadius })) }

  //*------------------------------------------ Keys
  function handleKeyDown({ code, ctrlKey }: { code: string, ctrlKey?: boolean }) {
    if (code === "Delete") clear()
    else if (ctrlKey && code === "KeyC") save()
    else if (ctrlKey && code === "KeyZ") undo()
  }

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (<div className={styles.container}>
    <Head>
      <title>Sign-app</title>
      <meta name="description" content="web-app for sign drawing" />
      <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.8em%22 font-size=%2290%22>🖋️</text></svg>" />
    </Head>

    <main className={styles.main}>
      <h1 className={styles.title}>Sign-app 🖋️</h1>
      <p>It was built to try something</p>


      <div className={styles.editor}>
        <CanvasDraw
          ref={signCanvas}
          className={styles.canvas}
          brushColor={settings.brushColor}
          lazyRadius={settings.lazyRadius}
          brushRadius={settings.lazyRadius}
        />

        <div className={styles.settings}>
          <div>
            <button className={styles.setting_button} onClick={undo}>[Ctrl+Z] Undo</button>
            <button className={styles.setting_button} onClick={clear}>[Delete] Clear</button>
          </div>

          <div className={styles.flex_column}>
            <label htmlFor="lazyRadius">Brush size</label>
            <input type="range" min={1} max={10} id="lazyRadius" autoFocus
              value={settings.lazyRadius}
              onChange={({ target }) => setLazyRadius(+target.value)} />

            <label htmlFor="brushColor">Ink</label>
            <input type="color" id="brushColor"
              value={settings.brushColor}
              onChange={({ target }) => setBrushColor(target.value)} />
          </div>

          <button
            ref={activeCopy}
            onClick={save}
            className={styles.setting_button}>
            [Ctrl+C] Copy
          </button>
        </div>
      </div>
    </main >


    <footer className={styles.footer}>
      Author:
      <a href="https://github.com/mskKote" target="_blank" rel="noopener noreferrer">
        Popov Vitaly
      </a>
    </footer>
  </div >)
}

export default Home
