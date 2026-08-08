import { useState } from "react";



export const GithubEmbed = ({
  url,
}: {
  url: string;
})=> {

  /*
    GitHub does not provide a universal
    repository iframe player.

    Therefore we show a useful GitHub
    preview with an iframe attempt and
    fallback link.
  */

  const [error, setError] = useState(false);


  if (error) {
    return (
      <IframeFallback url={url} message="GitHub does not allow this page to be embedded."/>
    );
  }


  return (
    <div
      className=" relative h-[420px] w-full overflow-hidden rounded-2xl bg-white">

      <iframe
        src={url}
        title="GitHub"
        className="
          h-full
          w-full
          border-0
        "
        onError={() =>
          setError(true)
        }
      />

    </div>

  );

}