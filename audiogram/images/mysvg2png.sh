# $ svg2png [file] [width] [height]
function svg2png {
    file=$1
    file_name="${file%.*}"
    file_ext="${file##*.}"
    shift
    width=${1:-"128"}
    height=${2:-"128"}

    if [ "${file_ext}" != "svg" ]; then
        printf "\n${file} is not an svg!\n"
    else
        rsvg -w $width -h $height "${file}" -o "${file_name}.png"
    fi
}


