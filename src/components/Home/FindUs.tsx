const LocationSection = () => {
    return (
     <div className="mx-auto w-11/12 border-none">
         <section className="py-8 md:py-12">
        <div className="mx-auto">
          <h1 className="mb-4 text-4xl font-bold tracking-tight lg:mb-7 lg:text-start lg:text-5xl lg:font-extrabold lg:leading-none">
            Find us here.
          </h1>
          <iframe
            title="tsyp location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3234.926745775051!2d10.586998875598706!3d35.8262729725408!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12fd8b3a0237010f%3A0x4418fc1f1a3cb73f!2sPolytechnique%20Sousse!5e0!3m2!1sfr!2stn!4v1742998613148!5m2!1sfr!2stn"
            className="w-full rounded-2xl shadow-md"
            height="500"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            style={{ border: '0px' }}
          ></iframe>
        </div>
      </section>
     </div>
    );
  };
  export default LocationSection;
  