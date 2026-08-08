


export const WebsiteEmbed = ({
  url,
  hasError,
  setError,
}: {
  url: string;
  hasError: boolean;
  setError: (value: boolean) => void;
})=> {

  if (hasError) {
    return (
      <IframeFallback url={url} message="This website does not allow iframe embedding."/>
    );
  }


  return (
    <div
      className="relative h-[450px] w-full overflow-hidden rounded-2xl bg-white">
      <iframe
        src={url}
        title="Website preview"
        className="
          h-full
          w-full
          border-0
        "
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        onError={() =>
          setError(true)
        }
      />

    </div>

  );

}