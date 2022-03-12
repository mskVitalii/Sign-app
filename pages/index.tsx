import { useState, useEffect, useRef } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import CanvasDraw, { CanvasDrawProps } from "react-canvas-draw";
import styles from '../styles/Home.module.scss'


/**
 * Canvas itself was built by react-canvas-draw;
 * For keyboard actions I use "useUffect" hook for client-side window API;
 */
const Home: NextPage = () => {

  //*------------------------------------------ Visual state
  const activeCopy = useRef<HTMLButtonElement>(null)
  function showCopied() {
    activeCopy.current?.focus()
    setTimeout(() => activeCopy.current?.blur(), 2000)
  }

  //*------------------------------------------ Canvas
  const signCanvas = useRef<CanvasDraw>(null);
  function clear() {
    signCanvas.current?.clear()
  }
  function undo() {
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
      <link rel="icon" href="/icon.svg" />
      {/* Common */}
      <meta charSet="UTF-8" />
      <meta name="description" content="web-app for sign drawing" />
      <meta name="keywords" content="Sign, draw sign" />
      <meta name="viewport" content="width=device-width" />
      <meta name="Author" content="Popov Vitaly" />
      {/* Social networks */}
      <meta property="og:locale" content="en_EN" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content="Sign-app" />
      <meta property="og:site_name" content="Sign-app" />
      <meta property="og:description" content="web-app for sign drawing" />
      <meta property="og:image" content="https://sign-app-mu.vercel.app/icon.svg" />
      <meta property="og:url" content="https://sign-app-mu.vercel.app" />
      {/* Twitter */}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:site" content="Popov Vitaly" />
      <meta name="twitter:title" content="Sign, draw sign" />
      <meta name="twitter:description" content="web-app for sign drawing" />
      <meta name="twitter:image" content="https://sign-app-mu.vercel.app/icon.svg" />
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
            <input type="range" min={1} max={10} id="lazyRadius"
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
