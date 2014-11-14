$(document).ready(function(){

    context.init({preventDoubleContext: false});
	context.attach('#audiogram_choices', [
		{header: 'Options'},
		{text: 'Open', href: '#'},
		{text: 'Open in new Window', href: '#'},
		{divider: true},
		{text: 'Copy', href: '#'},
		{text: 'Dafuq!?', href: '#'}
	]);
    
    context.settings({compress: true});
});