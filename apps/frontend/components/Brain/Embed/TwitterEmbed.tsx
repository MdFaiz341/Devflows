import { useEffect } from "react";




export const TwitterEmbed = ({
  url,
}: {
  url: string;
})=> {

  useEffect(() => {

    /*
      Twitter script creates the actual
      tweet embed.

      @ts-ignore is used because
      twttr is added globally by Twitter.
    */

    // @ts-ignore
    if (window.twttr?.widgets) {

      // @ts-ignore
      window.twttr.widgets.load();

    }

  }, [url]);


  return (

    <div
      className=" min-h-[150px] w-full overflow-hidden rounded-2xl bg-white/[0.02]">

      <blockquote
        className="twitter-tweet"
        data-theme="dark"
      >

        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
        >
          View post on X
        </a>

      </blockquote>

    </div>

  );

}