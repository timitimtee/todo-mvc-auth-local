import { useEffect, useRef, useState } from 'react'
import './UploadWidget.css'

// Reusable Cloudinary Upload Widget button.
//
// We do UNSIGNED uploads: the browser talks straight to Cloudinary using a
// public cloud name + an "unsigned" upload preset. No backend signing endpoint.
// On success we hand the parent result.info (parent reads result.info.secure_url)
// and store that full https://res.cloudinary.com/... URL in menu_item_image.
//
// The widget script (all.js) is loaded in index.html and attaches itself to
// window.cloudinary. React mounts before that global is guaranteed to exist, so
// on mount we poll briefly until window.cloudinary.createUploadWidget appears,
// then build the widget once and reuse it on each click.
export default function UploadWidget({
  onUploadSuccess,
  onUploadError,
  buttonText = 'Upload Image',
  className = '',
}) {
  const widgetRef = useRef(null)
  const [ready, setReady] = useState(false)

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

  useEffect(() => {
    let cancelled = false
    let attempts = 0
    const MAX_ATTEMPTS = 50 // ~5s at 100ms intervals before we give up

    function tryInit() {
      if (cancelled) return

      if (window.cloudinary && typeof window.cloudinary.createUploadWidget === 'function') {
        widgetRef.current = window.cloudinary.createUploadWidget(
          {
            cloudName,
            uploadPreset,
            sources: ['local', 'camera', 'url'],
            multiple: false,
          },
          (error, result) => {
            if (!error && result && result.event === 'success') {
              onUploadSuccess?.(result.info)
              return
            }
            if (error) {
              onUploadError?.(error)
            }
          }
        )
        setReady(true)
        return
      }

      attempts += 1
      if (attempts >= MAX_ATTEMPTS) {
        // Script never loaded (offline / blocked). Button stays disabled and we
        // surface it to the parent so it can decide what to show.
        onUploadError?.(new Error('Cloudinary upload widget failed to load'))
        return
      }
      setTimeout(tryInit, 100)
    }

    tryInit()

    return () => {
      cancelled = true
      // destroy() releases the iframe + listeners the widget created.
      if (widgetRef.current && typeof widgetRef.current.destroy === 'function') {
        widgetRef.current.destroy()
      }
    }
    // Re-create only if creds change. Handlers are read via latest closure each
    // call would normally need deps, but we intentionally keep this one-time;
    // see comment above — the callback uses the props captured at create time.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cloudName, uploadPreset])

  function openWidget() {
    if (widgetRef.current) widgetRef.current.open()
  }

  return (
    <button
      type="button"
      className={`upload-widget-btn ${className}`}
      onClick={openWidget}
      disabled={!ready}
    >
      {ready ? buttonText : 'Loading…'}
    </button>
  )
}
