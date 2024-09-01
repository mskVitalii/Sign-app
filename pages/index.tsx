import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import CanvasDraw, { CanvasDrawProps } from 'react-canvas-draw';
import styles from '../styles/Home.module.scss';

/**
 * Canvas itself was built by react-canvas-draw;
 * For keyboard actions I use "useUffect" hook for client-side window API;
 */
const Home: NextPage = () => {
  //*------------------------------------------ Visual states
  const copyBtn = useRef<HTMLButtonElement>(null);
  const saveBtn = useRef<HTMLButtonElement>(null);

  function showActive(ref: HTMLButtonElement | null) {
    ref?.focus();
    ref?.classList.toggle('active_button');
    setTimeout(() => {
      ref?.blur();
      ref?.classList.toggle('active_button');
    }, 2000);
  }

  const showCopied = useCallback(() => {
    showActive(copyBtn.current);
  }, []);

  const showSaved = useCallback(() => {
    showActive(saveBtn.current);
  }, []);

  //*------------------------------------------ Canvas Interaction
  const signCanvas = useRef<CanvasDraw>(null);
  const clear = useCallback(() => {
    signCanvas.current?.clear();
  }, []);
  const undo = useCallback(() => {
    signCanvas.current?.undo();
  }, []);

  const copy = useCallback(async () => {
    const src = (signCanvas.current as any).getDataURL();
    const blob = await (await fetch(src)).blob();
    const clipboardItem = new ClipboardItem({ [blob.type]: blob });
    await navigator.clipboard.write([clipboardItem]);
    showCopied();
  }, [showCopied]);

  const save = useCallback(() => {
    const src = (signCanvas.current as any).getDataURL();
    const link = document.createElement('a');
    link.href = src;
    link.download = 'sign.png';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showSaved();
  }, [showSaved]);

  //*------------------------------------------ Canvas settings
  const [settings, setSettings] = useState<CanvasDrawProps>({
    brushColor: '#00008B',
    lazyRadius: 1,
  });
  function setBrushColor(brushColor: string) {
    setSettings((x) => ({ ...x, brushColor }));
  }
  function setLazyRadius(lazyRadius: number) {
    setSettings((x) => ({ ...x, lazyRadius }));
  }

  //*------------------------------------------ Keys
  const handleKeyDown = useCallback(
    ({ code, ctrlKey }: { code: string; ctrlKey?: boolean }) => {
      if (code === 'Delete') clear();
      else if (ctrlKey && code === 'KeyC') copy();
      else if (ctrlKey && code === 'KeyZ') undo();
    },
    [clear, copy, undo]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Sign-app</title>
        <link rel='icon' href='/icon.svg' />
        {/* Common */}
        <meta charSet='UTF-8' />
        <meta name='viewport' content='width=device-width' />
        <meta
          name='description'
          content='Create and save your digital signatures easily with our intuitive sign drawing tool'
        />
        <meta name='keywords' content='Sign, draw sign, docs signing' />
        <meta name='Author' content='Popov Vitalii' />
        <meta name='distribution' content='global' />
        {/* Social networks */}
        <meta property='og:locale' content='en' />
        <meta property='og:type' content='website' />
        <meta property='og:title' content='Sign-app' />
        <meta property='og:site_name' content='Sign-app' />
        <meta
          name='og:description'
          content='Create and save your digital signatures easily with our intuitive sign drawing tool'
        />
        <meta
          property='og:image'
          content='https://sign-app-mu.vercel.app/icon.svg'
        />
        <meta property='og:url' content='https://sign-app-mu.vercel.app' />
        {/* Twitter */}
        <meta name='twitter:card' content='summary' />
        <meta name='twitter:site' content='Popov Vitalii' />
        <meta name='twitter:title' content='Sign, draw sign' />
        <meta
          name='twitter:description'
          content='Create and save your digital signatures easily with our intuitive sign drawing tool'
        />
        <meta
          name='twitter:image'
          content='https://sign-app-mu.vercel.app/icon.svg'
        />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Sign-app 🖋️</h1>

        <div className={styles.editor}>
          <CanvasDraw
            ref={signCanvas}
            className={styles.canvas}
            brushColor={settings.brushColor}
            lazyRadius={0}
            brushRadius={settings.lazyRadius}
            hideInterface={true}
          />

          <div className={styles.settings}>
            <div className={styles.columns_2}>
              <button className={styles.setting_button} onClick={undo}>
                <span className='mobile-hide shortcut'>[Ctrl+Z]</span>Undo
              </button>
              <button className={styles.setting_button} onClick={clear}>
                <span className='mobile-hide shortcut'>[Delete]</span>Clear
              </button>
            </div>

            <div className={styles.flex_column}>
              <div className={styles.columns_2}>
                <label htmlFor='lazyRadius'>Brush size</label>
                <input
                  type='range'
                  min={0.5}
                  max={3}
                  step={0.5}
                  id='lazyRadius'
                  value={settings.lazyRadius}
                  onChange={({ target }) => setLazyRadius(+target.value)}
                />
              </div>
              <div className={styles.columns_2}>
                <label htmlFor='brushColor'>Ink</label>
                <input
                  type='color'
                  id='brushColor'
                  value={settings.brushColor}
                  onChange={({ target }) => setBrushColor(target.value)}
                />
              </div>
            </div>

            <div className={styles.columns_2}>
              <button
                ref={copyBtn}
                onClick={copy}
                className={styles.setting_button}
              >
                {copyBtn.current?.classList.contains('active_button') ? (
                  'Copied 👌'
                ) : (
                  <>
                    <span className='mobile-hide shortcut'>[Ctrl+C]</span> Copy
                  </>
                )}
              </button>

              <button
                ref={saveBtn}
                onClick={save}
                className={styles.setting_button}
              >
                {saveBtn.current?.classList.contains('active_button') ? (
                  'Saved 👌'
                ) : (
                  <>
                    <span className='mobile-hide shortcut'>[Ctrl+S] </span> Save
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        Author:
        <a
          href='https://linktr.ee/mskVitalii'
          target='_blank'
          rel='noopener noreferrer'
        >
          Popov Vitalii
        </a>
      </footer>
    </div>
  );
};

export default Home;
