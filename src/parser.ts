type Subtitle = {
    index: number
    start: string
    end: string
    text: string
}

// returns the string formatted as a vtt file
export const toVtt = (subtitles: Subtitle[]): Blob => {
    let vtt = "WEBVTT\n\n"

    for (const sub of subtitles) {
        const start = sub.start.replace(",", ".")
        const end = sub.end.replace(",", ".")

        vtt += `${start} --> ${end}\n`
        vtt += `${sub.text}\n\n`
    }

    const blob = new Blob([vtt], {type: "text/vtt"})

    return blob
}

// parse srt file and returns vtt blob
export const parseFile = async (file: File): Promise<Subtitle[]> => {
    const text = await file.text()
    const lines = text.split(/\r?\n/)

    let subtitles: Subtitle[] = []
    let subtitle: Subtitle | null = null
    let textLines: string[] = []

    lines.forEach((line) => {

        // check if line is empty, if is, start new subtitle
        if (!line.trim()) {
            if (subtitle && textLines.length) {
                subtitle.text = textLines.join("\n")
                subtitles.push(subtitle)
            }
            subtitle = null
            textLines = []
            return
        }

        // first line will be index
        if (!subtitle) {
            subtitle = {
                index: Number(line),
                start: "",
                end: "",
                text: ""
            }
            return
        }

        // next comes timestamps, I am pretty sure that we do not need to check both timestamps
        if (!subtitle.start) {
            const times = line.split(" --> ")
            // TODO: handle case where not two timestmaps
            if (times.length === 2) {
                subtitle.start = times[0]
                subtitle.end = times[1]
            }
            return
        }
        textLines.push(line)
    })

    return subtitles
}
