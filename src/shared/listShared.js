export default {
    setCurrentList: function (ev) {
        let select, selected, id, name;
        if(ev)
            select = document.getElementById(ev.target.id);
        if(select) {
            id = select.options[select.selectedIndex].value;
            name = select.options[select.selectedIndex].text;
            selected = { id, name };
        }
        
        if(!id)
            selected = { id: '', name: null };                
        this.$store.commit('list/setCurrentList', selected);
    
    },
}