const audioContext = new (window.AudioContext || window.webkitAudioContext)();
document.addEventListener("alpine:init", () => {
    Alpine.data("form", () => ({
        loading: false,
        text: "",

        toSpeech: async ({ text }) => {
            const response = await axios.post("/", { text });
            fetch(response.data.audio)
                .then((response) => response.arrayBuffer())
                .then((data) => audioContext.decodeAudioData(data))
                .then((buffer) => {
                    const source = audioContext.createBufferSource();
                    source.buffer = buffer;
                    source.connect(audioContext.destination);
                    source.start();
                })
                .catch((error) =>
                    console.error(
                        "Error loading or decoding audio file:",
                        error
                    )
                );
        },
    }));
});
