export default {
    drag: function (ev) {
        ev.dataTransfer.setData("text", ev.target.id);
    },
}