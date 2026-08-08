import { IframeFallback } from "./IframeFallback";



export const YoutubeEmbed = ({
  embedUrl,
  title,
  hasError,
  setError,
}: {
  embedUrl: string;
  title: string;
  hasError: boolean;
  setError: (value: boolean) => void;
})=>{

  if (hasError) {

    return (
      <IframeFallback url={embedUrl} message="This YouTube video cannot be embedded."/>
    );

  }


  return (

    <div
      className=" relative aspect-video w-full overflow-hidden rounded-2xl bg-black">

      <iframe
        src={embedUrl}
        title={title}
        className="
          absolute
          inset-0
          h-full
          w-full
        "
        allow="
          accelerometer;
          autoplay;
          clipboard-write;
          encrypted-media;
          gyroscope;
          picture-in-picture;
          web-share
        "
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        onError={() =>
          setError(true)
        }
      />

    </div>

  );

}