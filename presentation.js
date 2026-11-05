'use strict';

/* A single, seekable film. Navigation moves its playhead, not a stack of slides.
 * Every object is created once. Poses, camera and connector drawing are all on
 * the same GSAP timeline, so reversing and scrubbing preserve spatial context. */
const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
const NS = 'http://www.w3.org/2000/svg';
const BEAT = 2.8;
const sceneData = [
  { name:'El atlas', kicker:'Una experiencia para descubrir juntos', title:'El saber<br>toma <em>forma.</em>', description:'De una gran idea a un recorrido que se puede explorar, comprender y aplicar.', fact:['Un recorrido','Cinco niveles conectados.<br>Una experiencia de aprendizaje.'], level:'Una mirada al conjunto', caption:'Avancemos juntos, desde el curso hasta el pequeño paso que estudia cada persona.', note:'Abramos el conocimiento', next:'Abrir el recorrido', script:'Comencemos mirando la estructura de una experiencia de aprendizaje. Vamos a recorrerla por dentro, como si abriéramos una carpeta y descubriéramos lo que contiene.' },
  { name:'Curso', kicker:'El punto de partida', title:'Un propósito.<br><em>Un curso.</em>', description:'Un tema con un objetivo de aprendizaje, un recorrido propio y momentos para aplicar lo aprendido.', fact:['12–18 h','De estudio activo por curso,<br>como referencia de la propuesta.'], level:'Curso · el recorrido completo', caption:'Ejemplo temático: Fundamentos de Medicina China. La selección de contenidos se trabaja con la escuela.', note:'Una experiencia con identidad', next:'Descubrir los módulos', script:'Un curso reúne una experiencia con sentido propio. Antes de producirlo, acordamos con la escuela qué aprendizajes queremos lograr y qué contenidos ayudarán a alcanzarlos.' },
  { name:'Módulos', kicker:'El curso se despliega', title:'Las grandes<br><em>ideas del viaje.</em>', description:'Los módulos ordenan el curso en grandes bloques temáticos. Cada uno reúne una parte del conocimiento.', fact:['1–3','Módulos por curso.<br>Grandes bloques con un hilo común.'], level:'Curso → Módulos', caption:'Aquí aparecen tres bloques de ejemplo. Sigamos uno de ellos para ver qué ocurre en su interior.', note:'Cada bloque tiene su lugar', next:'Entrar en un módulo', script:'La carpeta se abre y aparecen los módulos: los grandes bloques del recorrido. Sus nombres y distribución se definen con el equipo de la escuela. Sigamos el módulo de Yin Yang.' },
  { name:'Unidades', kicker:'Nos acercamos a un bloque', title:'Un tema<br>se vuelve <em>concreto.</em>', description:'Dentro de cada módulo, las unidades reúnen temas más específicos y su propia evaluación.', fact:['Hasta 6','Unidades en el conjunto del curso,<br>distribuidas entre sus módulos.'], level:'Módulo → Unidades', caption:'La distribución de dos unidades en este módulo es ilustrativa. Cada malla puede organizarse de otra manera.', note:'De lo general a lo específico', next:'Explorar una unidad', script:'Al entrar en un módulo encontramos unidades. Cada unidad delimita un tema y permite evaluar su comprensión. En este ejemplo seguimos dos temas relacionados con Yin Yang.' },
  { name:'Capítulos', kicker:'La unidad abre sus páginas', title:'Pequeñas lecciones.<br><em>Avance real.</em>', description:'Los capítulos dividen el tema en lecciones secuenciales, pensadas para estudiar una idea y luego continuar.', fact:['5–10','Capítulos por unidad, como rango.<br>Hasta 45 en el curso completo.'], level:'Unidad → Capítulos', caption:'Cada tarjeta representa una lección. La propuesta considera aproximadamente 4–7 minutos por capítulo.', note:'Un concepto encuentra su ritmo', next:'Desplegar un capítulo', script:'Las unidades se convierten en capítulos: pequeñas lecciones con continuidad. El ejemplo muestra ocho; el número se adapta al contenido. El conjunto del curso contempla hasta cuarenta y cinco.' },
  { name:'Pantallas', kicker:'Dentro de una lección', title:'Una idea,<br><em>paso a paso.</em>', description:'Dos tipos de pantalla se intercalan: contenido para comprender y preguntas para aplicar lo aprendido.', fact:['6–12','Pantallas por capítulo:<br>contenido y preguntas.'], level:'Capítulo → Pantallas', caption:'Secuencia ilustrativa de ocho pantallas. La retroalimentación forma parte de la pregunta: explica la respuesta, no es otra pantalla.', note:'Contenido · preguntas', next:'Acercarnos a una pantalla', script:'En el recorrido hay dos tipos de pantalla: contenido y preguntas. Se intercalan para comprender una idea y aplicarla. Al responder una pregunta aparece su explicación o retroalimentación en esa misma pantalla, antes de continuar. La propuesta considera entre seis y doce pantallas por capítulo.' },
  { name:'Aprender', kicker:'La experiencia del estudiante', title:'Comprender<br>con <em>claridad.</em>', description:'Una idea breve, un apoyo visual y un siguiente paso. La materia se adapta a una lectura cómoda en el celular.', fact:['Una pantalla','Una intención pedagógica.<br>Texto, imagen y ritmo de estudio.'], level:'Pantalla · comprender', caption:'Demostración conceptual del formato. El contenido y las imágenes se diseñan para el objetivo de cada lección.', note:'El detalle también enseña', next:'Probar una interacción', script:'Aquí la estructura se convierte en una experiencia tangible. Cada pantalla necesita redacción, síntesis, una imagen pertinente y una decisión sobre cómo acompañar al estudiante.' },
  { name:'Participar', kicker:'Aprender también es participar', title:'Elegir.<br>Descubrir.<br><em>Comprender.</em>', description:'Las preguntas invitan a aplicar la idea y reciben una explicación inmediata. Puedes probar las alternativas.', fact:['Retroalimentación','La respuesta abre<br>otro momento de aprendizaje.'], level:'Pantalla · aplicar', caption:'Pregunta de demostración. Se puede cambiar de alternativa y leer ambas explicaciones.', note:'Prueba las respuestas', next:'Volver a ver el conjunto', script:'Invita a responder. La retroalimentación explica por qué una alternativa se ajusta al concepto. Ese diálogo es parte del diseño del curso y acompaña la comprensión.' },
  { name:'El conjunto', kicker:'La cámara se aleja', title:'Todo encuentra<br><em>su lugar.</em>', description:'Los pequeños pasos construyen un recorrido completo. Así se conectan los niveles de un curso.', fact:['3 · 6 · 45','Hasta 3 módulos, 6 unidades<br>y 45 capítulos por curso.'], level:'La arquitectura completa', caption:'Una distribución posible: 3 módulos, 2 unidades por módulo y 15 capítulos entre ambas unidades.', note:'Cada bloque verde es un capítulo', next:'Descubrir las pantallas', script:'Al alejarnos vemos cómo se relaciona todo. Esta es una distribución ilustrativa de la capacidad de referencia: tres módulos, seis unidades y cuarenta y cinco capítulos en total.' },
  { name:'710 pantallas', kicker:'La suma de los pequeños pasos', title:'710 pantallas.<br><em>Un recorrido.</em>', description:'La capacidad de referencia reúne hasta 710 pantallas entre síntesis conceptual, práctica y evaluaciones.', fact:['315 + 395','Pantallas conceptuales<br>y pantallas de evaluación.'], level:'El volumen del curso · hasta 710 pantallas', caption:'Cada marca representa una pantalla. Las evaluaciones de unidad y el integrador se suman a las lecciones.', note:'Una marca · una pantalla', next:'Mirar la evaluación', script:'Aquí cada marca es una pantalla. La propuesta contempla hasta trescientas quince conceptuales y trescientas noventa y cinco de evaluación. La cantidad se organiza según los aprendizajes del curso.' },
  { name:'Evaluación', kicker:'Tres momentos para consolidar', title:'La práctica<br>acompaña <em>el viaje.</em>', description:'Preguntas dentro de las lecciones, evaluaciones al cerrar unidades y una instancia integradora al final.', fact:['Hasta 395','Preguntas con explicación,<br>distribuidas en tres momentos.'], level:'Aprender → Consolidar → Integrar', caption:'Referencia de la propuesta: hasta 225 formativas, 120 de unidad y 50 del examen integrador.', note:'La evaluación forma parte del recorrido', next:'Descubrir la capa visual', script:'Las preguntas cumplen funciones distintas: practicar durante la lección, consolidar una unidad e integrar el recorrido completo. La propuesta las distribuye en estos tres momentos.' },
  { name:'Universo visual', kicker:'Una identidad que acompaña', title:'El contenido<br>también se <em>ve.</em>', description:'Portadas, ilustraciones, esquemas y guías dan identidad al recorrido y ayudan a comprender cada tema.', fact:['Hasta 240','Recursos visuales por curso.<br>Del catálogo a la lección.'], level:'Dirección de arte · recursos del recorrido', caption:'Muestras de arte real de Zhen: portada de curso, banners y guía de estudio. Los temas se adaptan a cada curso.', note:'Arte real de la aplicación', next:'Ver cómo se construye', script:'Estos son recursos reales presentes en Zhen. Las portadas ayudan a reconocer el curso, los banners orientan dentro del módulo y las ilustraciones apoyan el aprendizaje. La propuesta contempla hasta doscientos cuarenta recursos.' },
  { name:'La construcción', kicker:'De los insumos a la experiencia', title:'El conocimiento<br>se <em>transforma.</em>', description:'El material de la escuela se organiza, se sintetiza, se diseña y se convierte en una experiencia que se revisa en conjunto.', fact:['Un proceso','Contenido → estructura → diseño<br>→ interacción → revisión.'], level:'La construcción del curso', caption:'Cada etapa aporta algo distinto. Los contenidos y su revisión pedagógica dan forma al resultado.', note:'Una construcción compartida', next:'Ver el trabajo detrás', script:'La producción conecta varios trabajos: recibir y comprender los insumos, organizar la estructura, sintetizar, diseñar los recursos y programar la interacción. Finalmente revisamos el recorrido.' },
  { name:'Producir las preguntas', kicker:'Detrás de cada interacción · el equipo', title:'Una pregunta.<br><em>Mucho trabajo.</em>', description:'Nuestros profesionales redactan cada pregunta, sus alternativas y su explicación. Después implementan la interacción, la cargan en la plataforma y revisan su funcionamiento.', fact:['Hasta 395','Preguntas con retroalimentación<br>por curso, según la propuesta.'], level:'Diseñar → Implementar → Cargar → Revisar', caption:'Cada pieza recorre el proceso completo. El mosaico representa el banco de preguntas; es un volumen de referencia, no una tarea única.', note:'Una pregunta incluye alternativas y explicación', next:'Ver las pantallas de contenido', script:'Detengámonos en el trabajo del equipo. Una pregunta requiere redacción, alternativas plausibles y una explicación. Luego hay que implementar la respuesta interactiva, integrarla a la plataforma y comprobar que funcione. Ese trabajo se realiza para cada pregunta del banco, hasta trescientas noventa y cinco en la propuesta.' },
  { name:'Producir el contenido', kicker:'Detrás de cada explicación · el equipo', title:'Cada idea<br>se <em>construye.</em>', description:'El equipo transforma la materia en síntesis comprensibles, diseña la lectura, implementa cada pantalla y la carga al curso. Después revisa el contenido y su visualización.', fact:['Hasta 315','Pantallas de síntesis conceptual<br>por curso, según la propuesta.'], level:'Sintetizar → Diseñar → Cargar → Revisar', caption:'Cada marca es una pantalla conceptual. Estas 315 forman parte del conjunto de hasta 710 pantallas del curso.', note:'Síntesis · jerarquía · lectura en celular', next:'Ver los recursos visuales', script:'Las pantallas conceptuales también tienen un proceso propio. Hay que comprender la materia, sintetizarla, organizar su lectura, implementarla e integrarla al recorrido. Después se revisa tanto la explicación como su presentación. La propuesta contempla hasta trescientas quince.' },
  { name:'Producir las imágenes', kicker:'Detrás de cada recurso visual · el equipo', title:'Cada imagen<br>tiene <em>un proceso.</em>', description:'Nuestros profesionales diseñan o adaptan cada recurso, preparan sus formatos, lo optimizan y lo cargan. Finalmente revisan que explique el tema y se vea bien dentro de la plataforma.', fact:['Hasta 240','Recursos visuales por curso:<br>portadas, banners e ilustraciones.'], level:'Diseñar → Adaptar → Cargar → Revisar', caption:'El volumen incluye recursos de navegación e imágenes de apoyo. Cada uno necesita tratamiento e integración, además del trabajo sobre preguntas y contenido.', note:'Diseño · formatos · optimización · integración', next:'Crear la guía de estudio', script:'Las imágenes no terminan cuando se diseñan. Cada recurso necesita formato, adaptación, optimización, carga y revisión en su contexto. Este trabajo se repite para portadas, banners, guías e ilustraciones: hasta doscientos cuarenta recursos según la propuesta.' },
  { name:'Guía de estudio PDF', kicker:'Un recurso que acompaña cada unidad', title:'Del contenido<br>nace una <em>guía.</em>', description:'Seleccionamos los conceptos esenciales, los resumimos y redactamos como material de estudio. Luego diseñamos la guía, la validamos y la preparamos para descargar.', fact:['Guía PDF','Síntesis, redacción y diseño editorial<br>según la malla acordada.'], level:'Seleccionar → Redactar → Diseñar → Publicar', caption:'El archivo final se revisa con la escuela, se exporta, se optimiza y se integra a la unidad para que el estudiante pueda descargarlo.', note:'Lectura clara · versión descargable', next:'Preparar a la comunidad', script:'La guía no es una copia automática del contenido. El equipo selecciona lo esencial, organiza una secuencia, resume y redacta con lenguaje de estudio. Después corrige, diseña la portada y la maqueta, incorpora los esquemas necesarios, valida el contenido con la escuela, exporta un PDF optimizado y comprueba su descarga desde la unidad.' },
  { name:'Capacitación presencial', kicker:'La plataforma también se aprende acompañados', title:'Comenzamos<br><em>juntos.</em>', description:'Realizamos una capacitación presencial en Temuco para mostrar, explicar y practicar el uso de la plataforma con estudiantes y profesores.', fact:['En Temuco','Sesión guiada para estudiantes<br>y equipo docente.'], level:'Ingresar → Recorrer → Practicar → Acompañar', caption:'Se revisan acceso, navegación, ruta de aprendizaje, capítulos, preguntas, evaluaciones, progreso y canales de soporte. La propuesta contempla hasta 2 instancias por semestre.', note:'Capacitación presencial · Temuco', next:'Ampliar la mirada', script:'La puesta en marcha incluye una capacitación presencial en Temuco. Con estudiantes practicamos el ingreso, la navegación, el estudio de capítulos, las preguntas, evaluaciones y consulta de progreso. Con profesores revisamos el recorrido del alumno, cómo orientarlo, resolver situaciones habituales y utilizar los canales de soporte. La propuesta contempla hasta dos instancias por semestre, coordinadas con la escuela.' },
  { name:'La continuidad', kicker:'Una estructura que puede crecer', title:'Nuevos temas.<br><em>Nuevos recorridos.</em>', description:'El campus reúne cursos con identidad propia. La misma estructura permite incorporar nuevos objetivos y conectar la malla de la escuela.', fact:['Una malla viva','Cada curso aporta<br>una experiencia al conjunto.'], level:'Campus → Cursos → Recorridos', caption:'Esquema de continuidad: la selección de temas y el ritmo de incorporación se acuerdan con la escuela.', note:'El campus conecta las experiencias', next:'Imaginar el primer recorrido', script:'Con una estructura clara podemos pensar la continuidad. La escuela define sus objetivos y la secuencia; cada nuevo curso suma una experiencia al campus y se conecta con los demás.' },
  { name:'El primer recorrido', kicker:'El próximo paso, juntos', title:'Démosle forma<br>al <em>primer recorrido.</em>', description:'Elegimos los aprendizajes, organizamos los contenidos y acordamos la estructura que mejor los acompaña.', fact:['Primero, el objetivo','Después, los módulos.<br>Y desde allí, cada pequeño paso.'], level:'Una experiencia con sentido, de principio a fin', caption:'Un curso se construye desde el aprendizaje que queremos lograr. Ese es nuestro punto de partida.', note:'Del conocimiento al recorrido', next:'Volver al comienzo', script:'Cerremos con una invitación: elegir el propósito del primer curso y revisar juntos cómo organizar sus contenidos. La estructura que acabamos de recorrer nos da un lenguaje común para diseñarlo.' }
];

const elements = new Map();
function add(id, html, className='') {
  const g=document.createElementNS(NS,'g');
  g.id=id; g.setAttribute('class',`film-object ${className}`);
  g.innerHTML=html; $('#world').append(g); elements.set(id,g); return g;
}
function txt(x,y,text,cls='',anchor='middle') { return `<text x="${x}" y="${y}" text-anchor="${anchor}" class="${cls}">${text}</text>`; }
function folder(id, title, subtitle, material='jade', size=1) {
  const titles=title.split('|');
  const g=add(id,`<ellipse cx="0" cy="117" rx="166" ry="13" fill="#23392d" opacity=".06"/><g class="folder-body" filter="url(#shadow)"><path d="M-168-103q0-12 12-12h93l19 23h197q15 0 15 15V97q0 16-16 16h-304q-16 0-16-16z" fill="url(#${material})" stroke="#254331" stroke-opacity=".18"/><g class="folder-paper"><path d="M-149-83h298V96h-298z" fill="#ddd8c8" transform="rotate(-5)"/><path d="M-149-86h298V96h-298z" fill="#f9f5e8" transform="rotate(2)"/><path d="M-119-53h192m-192 14h235m-235 14h186" stroke="#bfc5b0" stroke-width="2"/></g><g class="folder-cover"><path d="M-174-57q0-14 15-14h318q15 0 15 14l-12 153q-1 17-17 17h-290q-16 0-17-17z" fill="url(#${material})" stroke="#e9e6d5" stroke-opacity=".35"/><path d="M-150-53h300" stroke="#fff" stroke-opacity=".12"/>${txt(0,-26,subtitle,'label '+(material==='jade'?'white':''))}${titles.map((t,i)=>txt(0,14+i*34,t,'serif '+(material==='jade'?'white':''))).join('')}<path d="M-14 85h28" stroke="${material==='jade'?'#d4bb8c':'#4e6550'}" stroke-width="2"/></g></g>`,'folder-object');
  g.dataset.size=size; return g;
}
folder('course','Fundamentos de|Medicina China','CURSO');
['Fundamentos','Yin Yang','Aplicación'].forEach((title,i)=>folder(`module${i}`,title,`MÓDULO ${i+1}`,'amber',.61));
['Relación Yin–Yang','Yin–Yang en el cuerpo'].forEach((title,i)=>folder(`unit${i}`,title,`UNIDAD ${i+1}`,'slate',.58));
for(let i=0;i<8;i++) add(`chapter${i}`,`<rect x="-63" y="-88" width="126" height="176" rx="5" fill="url(#page)" stroke="#c8ceba" filter="url(#shadow)"/><path d="M-48-68h96" stroke="#9aac8c"/>${txt(0,-46,'CAPÍTULO','tiny muted')}${txt(0,6,String(i+1).padStart(2,'0'),'serif')}<path d="M-31 28h62m-62 10h49m-49 10h57" stroke="#bcc5ae" stroke-width="2"/>${txt(0,72,i===0?'Interdependencia':'Una lección','tiny')}`);
const screenSequence=['content','content','question','content','question','content','content','question'];
const screenKinds={
  content:{label:'Contenido',fill:'#f9f7ed',stroke:'#97ac8d',art:'<path d="M-31-34h62m-62 10h48" stroke="#a5b298" stroke-width="2"/><rect x="-31" y="-8" width="62" height="45" rx="4" fill="#dce3cf"/><circle cx="13" cy="4" r="5" fill="#a4ba91"/><path d="m-25 29 14-21 11 14 9-8 16 17" fill="none" stroke="#718b68" stroke-width="2"/>'},
  question:{label:'Pregunta',fill:'#f3e7cf',stroke:'#b79a65',art:'<circle cx="0" cy="-22" r="17" fill="#dfc58e"/><text x="0" y="-13" text-anchor="middle" class="serif">?</text><g fill="none" stroke="#9c865f"><circle cx="-25" cy="8" r="4"/><circle cx="-25" cy="26" r="4"/><path d="M-13 8h42M-13 26h35" stroke-width="2"/></g>'}
};
screenSequence.forEach((type,i)=>{
  const kind=screenKinds[type];
  const screen=add(`screen${i}`,`<rect x="-52" y="-84" width="104" height="168" rx="9" fill="${kind.fill}" stroke="${kind.stroke}"/><rect x="-12" y="-75" width="24" height="3" rx="2" fill="${kind.stroke}"/>${txt(-35,-54,String(i+1).padStart(2,'0'),'tiny muted','start')}${kind.art}<path d="M-39 48h78" stroke="${kind.stroke}" stroke-opacity=".4"/>${txt(0,67,kind.label,'screen-kind-label')}`);
  screen.dataset.screenKind=type;
});
add('orbit',`<circle class="orbit-stroke" r="290"/><circle class="orbit-stroke" r="235" stroke-dasharray="2 7"/><path d="M-310 0h40m540 0h40M0-310v40m0 540v40" stroke="#b8c4a8"/>${['Curso','Módulo','Unidad','Capítulo','Pantalla'].map((t,i)=>{const a=(i/5)*Math.PI*2-Math.PI/2;return `<g transform="translate(${Math.cos(a)*290},${Math.sin(a)*290})"><rect x="-52" y="-15" width="104" height="30" rx="15" fill="#eeece3" stroke="#b9c6aa"/>${txt(0,4,t,'tiny')}</g>`;}).join('')}`);
add('phone',`<rect x="-153" y="-269" width="306" height="538" rx="42" fill="#234e40" filter="url(#shadow)"/><rect x="-145" y="-261" width="290" height="522" rx="36" fill="#faf7ed"/><rect x="-40" y="-248" width="80" height="6" rx="3" fill="#234e40"/><path d="M-27 247h54" stroke="#91a284" stroke-width="3"/>`);
add('phone-content',`${txt(-116,-213,'TEORÍA YIN YANG','tiny muted','start')}${txt(115,-213,'1 / 8','tiny muted','end')}<path d="M-115-191h230" stroke="#d8dfcc" stroke-width="3"/><path d="M-115-191h35" stroke="#5a815f" stroke-width="3"/>${txt(-115,-152,'UN EQUILIBRIO','label','start')}${txt(-115,-111,'dinámico.','serif','start')}<rect x="-116" y="-83" width="232" height="151" rx="5" fill="#dce3cf"/><g transform="translate(0 -8)"><circle r="55" fill="#294d3d"/><path d="M0-55a27.5 27.5 0 0 1 0 55 27.5 27.5 0 0 0 0 55 55 55 0 0 0 0-110" fill="#f2eddb"/><circle cy="-27.5" r="8" fill="#f2eddb"/><circle cy="27.5" r="8" fill="#294d3d"/></g>${txt(-115,100,'Yin y Yang se relacionan,','tiny','start')}${txt(-115,121,'se necesitan y se transforman.','tiny','start')}<path d="M-115 147h222m-222 11h192" stroke="#bac5ad"/><rect x="-116" y="185" width="232" height="38" rx="4" fill="#285e4e"/>${txt(0,209,'Continuar →','tiny white')}`);
add('phone-lines',`<path class="connection" d="M-152-70h-75l-35-28h-78M153 80h59l37 33h95"/>${txt(-350,-115,'UNA IDEA BREVE','tiny muted','end')}${txt(354,144,'UN SIGUIENTE PASO','tiny muted','start')}`);

// The aggregate course is one graphic, not a set of unrelated panels.
add('architecture',`${folderGlyph(0,-220,1.05,'CURSO')}${[0,1,2].map((m)=>{const x=(m-1)*260;return `<g transform="translate(${x} 0)">${folderGlyph(0,-25,.55,`MÓDULO ${m+1}`)}${[0,1].map(u=>`<g transform="translate(${u===0?-62:62} 105)"><rect x="-52" y="-39" width="104" height="146" rx="6" fill="#dde3d0" stroke="#a8b99a"/>${txt(0,-18,`Unidad ${m*2+u+1}`,'tiny')}${Array.from({length:u===0?8:7},(_,i)=>`<rect class="chapter-mark" x="${-35+(i%3)*25}" y="${i<3?0:i<6?31:62}" width="19" height="24" rx="2" fill="#4e795b"/>`).join('')}</g>`).join('')}</g>`}).join('')}<path class="connection arch-line" d="M0-157v47M-260-110H260M-260-110v32M0-110v32M260-110v32M-260 29v36M0 29v36M260 29v36"/>${txt(0,290,'3 MÓDULOS    /    6 UNIDADES    /    45 CAPÍTULOS','label')}`);
function folderGlyph(x,y,s,label){return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-90-49h64l12 13H90V54H-90z" fill="#436b53"/><path d="M-94-22H94L84 62H-84z" fill="#5b8162"/>${txt(0,23,label,'label white')}</g>`;}

const cellColors=['#386a50','#9eb68b','#be8868','#53684b'];
const cells=[];
for(let i=0;i<710;i++) {
  const type=i<315?0:i<540?1:i<660?2:3;
  const g=add(`cell${i}`,`<rect x="-6.3" y="-9" width="12.6" height="18" rx="1.7" fill="${cellColors[type]}"/><path d="M-3.4-4h6.8M-3.4-1h4.8" stroke="#f3f0df" stroke-opacity=".55" stroke-width=".9"/>`,'mosaic-cell');
  cells.push({el:g,type,index:i});
}
add('mosaic-legend',`${txt(-350,329,'315 · SÍNTESIS CONCEPTUAL','tiny','start')}${txt(350,329,'395 · EVALUACIÓN','tiny','end')}`);
add('evaluation-labels',`${txt(-280,190,'225','serif')}${txt(-280,218,'En las lecciones','tiny muted')}${txt(0,190,'120','serif')}${txt(0,218,'Al cerrar unidades','tiny muted')}${txt(280,190,'50','serif')}${txt(280,218,'En el integrador','tiny muted')}<path d="M-180 15h80m200 0h80" stroke="#b0bea0" stroke-dasharray="3 5"/>`);

[['cover','assets/curso.jpg',160,208],['guide-art','assets/guia.jpg',160,208],['banner','assets/modulo.jpg',290,168],['banner2','assets/sustancias.jpg',290,168]].forEach(([id,src,w,h])=>{
  add(id,`<rect x="${-w/2-7}" y="${-h/2-7}" width="${w+14}" height="${h+14}" rx="3" fill="#faf7ec" stroke="#c4c9b5" filter="url(#shadow)"/><image href="${src}" x="${-w/2}" y="${-h/2}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice"/>`);
});
add('art-labels',`${txt(-232,258,'PORTADA DE CURSO','tiny muted')}${txt(30,258,'BANNERS','tiny muted')}${txt(270,258,'GUÍA DE ESTUDIO','tiny muted')}`);
['Contenido','Estructura','Diseño','Interacción','Revisión'].forEach((label,i)=>add(`process${i}`,`<circle r="43" fill="${i===4?'#285e4e':'#e1e5d5'}" stroke="#a4b693"/><g fill="none" stroke="${i===4?'#f4efdd':'#567550'}" stroke-width="1.8">${['<path d="M-15-19h23l9 9v29h-32zM7-19v11h10M-8 0h17M-8 7h17M-8 14H3"/>','<path d="M0-19v13M-23-6h46M-23-6v13M23-6v13M0-6v13"/><rect x="-32" y="7" width="18" height="15" rx="2"/><rect x="-9" y="7" width="18" height="15" rx="2"/><rect x="14" y="7" width="18" height="15" rx="2"/>','<path d="m-23 16 13-30 10 19 13-26 12 37z"/><circle cx="-11" cy="-17" r="4"/>','<rect x="-14" y="-24" width="28" height="48" rx="4"/><path d="M-6-15H6M-5 15H5"/><circle r="5"/>','<path d="m-19 0 12 12 27-27"/>'][i]}</g>${txt(0,76,label,'tiny')}`));
const processPoints=[[-320,50],[-160,-70],[0,50],[160,-70],[320,50]];
add('process-line',processPoints.slice(1).map(([x,y],i)=>{
  const [previousX,previousY]=processPoints[i],middleX=(previousX+x)/2;
  return `<path id="process-link${i}" d="M${previousX} ${previousY}C${middleX} ${previousY} ${middleX} ${y} ${x} ${y}" class="connection process-connection"/>`;
}).join(''));
$('#world').prepend($('#process-line'));

const productionBoards=[
  {id:'work-questions',scene:13,count:395,label:'PREGUNTAS',color:'#b39359',origin:[4800,1600],center:[6800,1600],steps:['Diseñar','Implementar','Cargar','Revisar'],details:['Alternativas + explicación','Lógica y respuesta','Integración al curso','Contenido + funcionamiento'],sample:'question'},
  {id:'work-content',scene:14,count:315,label:'PANTALLAS CONCEPTUALES',color:'#688b62',origin:[6800,1600],center:[8000,1600],steps:['Sintetizar','Diseñar','Cargar','Revisar'],details:['Comprender la materia','Lectura + implementación','Integración al curso','Claridad + visualización'],sample:'content'},
  {id:'work-images',scene:15,count:240,label:'RECURSOS VISUALES',color:'#7c988f',origin:[8000,1600],center:[9200,1600],steps:['Diseñar','Adaptar','Cargar','Revisar'],details:['Concepto visual','Formato + optimización','Integración al curso','Pertinencia + visualización'],sample:'image'}
];
productionBoards.forEach(board=>{
  const batches=[];
  for(let start=0;start<board.count;start+=25){
    const tiles=Array.from({length:Math.min(25,board.count-start)},(_,j)=>{
      const i=start+j,x=(i%25-12)*27,y=110+Math.floor(i/25)*11;
      const glyph=board.sample==='image'?`<path d="m${x-7} ${y+2} 4-4 4 5 3-2 3 3" fill="none" stroke="#f5f2e5" stroke-width=".8"/>`:`<path d="M${x-6} ${y-1}h12m-12 3h8" stroke="#f5f2e5" stroke-width=".8"/>`;
      return `<g class="work-piece"><rect x="${x-10}" y="${y-4}" width="20" height="9" rx="1.5" fill="${board.color}"/>${glyph}</g>`;
    }).join('');
    batches.push(`<g class="work-batch">${tiles}</g>`);
  }
  const sample=board.sample==='question'?`${txt(0,-11,'?','serif')}<path d="M-26 5h52m-52 12h44m-44 12h48" stroke="#b39359" stroke-width="2"/>`:board.sample==='content'?'<path d="M-28-28h56m-56 12h45m-45 12h51" stroke="#829976" stroke-width="2"/><rect x="-28" y="12" width="56" height="25" rx="3" fill="#cfddc2"/>':'<image href="assets/guia.jpg" x="-30" y="-43" width="60" height="86" preserveAspectRatio="xMidYMid slice"/>';
  add(board.id,`
    ${txt(0,-317,'CADA PIEZA RECORRE CUATRO ETAPAS','label muted')}
    <path class="connection work-route" d="M-285-30H285"/>
    ${board.steps.map((step,i)=>`<g transform="translate(${(i-1.5)*190} -30)"><circle class="work-station" r="29" fill="#e2e7d6" stroke="${board.color}"/><circle class="station-ring station-ring${i}" r="34" fill="none" stroke="${board.color}" stroke-width="2"/>${txt(0,5,String(i+1).padStart(2,'0'),'tiny')}${txt(0,58,step,'work-step-label')}${txt(0,80,board.details[i],'work-detail')}</g>`).join('')}
    <g class="work-traveler">
      <rect x="-43" y="-59" width="86" height="118" rx="5" fill="#faf7ec" stroke="${board.color}" filter="url(#shadow)"/>
      ${sample}
      <g class="work-approved"><circle cx="33" cy="48" r="14" fill="#285e4e"/><path d="m26 48 5 5 10-11" fill="none" stroke="#f6f2e5" stroke-width="2"/></g>
    </g>
    ${batches.join('')}
    <text class="work-counter" x="-335" y="-224">0</text>
    ${txt(-335,-196,`HASTA ${board.count} ${board.label}`,'tiny muted','start')}
  `,'work-board');
});

add('pdf-guide',`
  ${txt(0,-294,'DE LOS CONTENIDOS A UNA GUÍA DESCARGABLE','label muted')}
  <path class="connection pdf-route" d="M-285 0H285"/>
  <g class="pdf-step" transform="translate(-285 0)">
    <circle r="39" fill="#e3e7d8" stroke="#78916e"/>
    <path d="M-18-20h27l10 10v31h-37zM8-20v12h11M-10 0h21M-10 8h21" fill="none" stroke="#567550" stroke-width="2"/>
    ${txt(0,70,'Seleccionar','work-step-label')}${txt(0,92,'Conceptos esenciales + orden','work-detail')}
  </g>
  <g class="pdf-step" transform="translate(-95 0)">
    <circle r="39" fill="#e3e7d8" stroke="#78916e"/>
    <path d="M-20-22h40v44h-40zM-12-12h24M-12-4h20M-12 4h24M-12 12h15" fill="none" stroke="#567550" stroke-width="2"/>
    ${txt(0,70,'Redactar','work-step-label')}${txt(0,92,'Síntesis pedagógica','work-detail')}
  </g>
  <g class="pdf-step" transform="translate(95 0)">
    <circle r="39" fill="#e3e7d8" stroke="#78916e"/>
    <rect x="-23" y="-27" width="46" height="54" rx="2" fill="#f8f4e7" stroke="#567550"/>
    <rect x="-16" y="-20" width="32" height="17" fill="#b9cab0"/><path d="M-16 5h32M-16 12h25M-16 19h29" stroke="#7b9271" stroke-width="2"/>
    ${txt(0,70,'Diseñar','work-step-label')}${txt(0,92,'Portada + maquetación','work-detail')}
  </g>
  <g class="pdf-step" transform="translate(285 0)">
    <circle r="39" fill="#285e4e" stroke="#78916e"/>
    <path class="pdf-download-arrow" d="M0-20v28m-11-9L0 10 11-1M-18 20h36" fill="none" stroke="#f5f1e3" stroke-width="2.5"/>
    ${txt(0,70,'Publicar','work-step-label')}${txt(0,92,'Validar + exportar + cargar','work-detail')}
  </g>
  <g class="pdf-source-pages" transform="translate(-285 -150)">
    <rect x="-37" y="-46" width="74" height="92" rx="3" fill="#ddd8c8" stroke="#b5bea9" transform="rotate(-7)"/>
    <rect x="-37" y="-46" width="74" height="92" rx="3" fill="#f9f5e8" stroke="#b5bea9" transform="rotate(5)"/>
    <path d="M-25-25h50m-50 10h42m-42 10h50m-50 10h35m-35 10h47" stroke="#9ead90" stroke-width="2"/>
  </g>
  <g class="pdf-final-cover" transform="translate(285 -156)">
    <rect x="-48" y="-67" width="96" height="134" rx="4" fill="#faf7ec" stroke="#a5b69a" filter="url(#shadow)"/>
    <image href="assets/guia.jpg" x="-42" y="-61" width="84" height="122" preserveAspectRatio="xMidYMid slice"/>
    <g class="pdf-approved"><circle cx="38" cy="56" r="17" fill="#285e4e"/><path d="m30 56 6 6 12-14" fill="none" stroke="#f6f2e5" stroke-width="2.4"/></g>
  </g>
  ${txt(-350,178,'RESUMIR','tiny muted','start')}${txt(350,178,'DESCARGAR','tiny muted','end')}
`,'pdf-guide');

const person=(x,y,role='training-person')=>`<g class="${role}" transform="translate(${x} ${y})"><circle cy="-13" r="8" fill="#6f8b6a"/><path d="M-13 13q1-19 13-19t13 19" fill="#dce4d2" stroke="#6f8b6a"/></g>`;
add('training',`
  ${txt(0,-302,'CAPACITACIÓN PRESENCIAL · TEMUCO','label muted')}
  <g class="training-screen">
    <rect x="-142" y="-242" width="284" height="145" rx="7" fill="#faf7ec" stroke="#78916e" filter="url(#shadow)"/>
    <rect x="-128" y="-226" width="256" height="22" rx="3" fill="#285e4e"/>
    ${txt(-112,-211,'TAOVITAL · CAMPUS','tiny white','start')}
    <path d="M-113-181h76m-76 14h101m-101 14h88" stroke="#a9b89c" stroke-width="3"/>
    <circle cx="76" cy="-169" r="24" fill="#dce4d2"/><path d="m65-168 8 8 16-19" fill="none" stroke="#467251" stroke-width="3"/>
  </g>
  <g class="training-facilitator">${person(0,-38,'training-person facilitator')}${txt(0,12,'Facilitador','tiny muted')}</g>
  <path class="connection training-link" d="M-24-18C-90 8-125 40-190 67"/>
  <path class="connection training-link" d="M24-18C90 8 125 40 190 67"/>
  <g class="audience audience-students">
    ${person(-245,62)}${person(-205,45)}${person(-165,62)}${person(-225,101)}${person(-185,101)}
    ${txt(-205,145,'ESTUDIANTES','label')}${txt(-205,166,'Ingresar · estudiar · evaluar','work-detail')}
  </g>
  <g class="audience audience-teachers">
    ${person(165,62)}${person(205,45)}${person(245,62)}${person(185,101)}${person(225,101)}
    ${txt(205,145,'PROFESORES','label')}${txt(205,166,'Orientar · acompañar · resolver','work-detail')}
  </g>
  <g class="training-topics">
    ${['Acceso','Navegación','Evaluaciones','Progreso','Soporte'].map((label,i)=>`<g class="training-topic" transform="translate(${(i-2)*135} 236)"><rect x="-55" y="-17" width="110" height="34" rx="17" fill="#e2e7d8" stroke="#a4b494"/>${txt(0,4,label,'tiny')}</g>`).join('')}
  </g>
  <g class="temuco-pin" transform="translate(-325 -245)"><path d="M0-17a17 17 0 0 1 17 17c0 13-17 31-17 31S-17 13-17 0A17 17 0 0 1 0-17Z" fill="#b25c43"/><circle r="5" fill="#f5f1e4"/>${txt(29,5,'TEMUCO','label muted','start')}</g>
`,'training-scene');

folder('future0','Otro tema','CURSO','slate',.56);
folder('future1','Nuevo recorrido','CURSO','amber',.56);
add('campus',`<circle r="85" fill="#e3e6d8" stroke="#a2b494"/><circle r="70" fill="none" stroke="#bdc9ae"/>${txt(0,-8,'TAOVITAL','label')}${txt(0,23,'Campus','serif')}<path d="M-85 0h-100m270 0h100M0-85v-80" stroke="#9eaf91" stroke-dasharray="3 5"/>`);
add('closing',`<circle r="230" fill="none" stroke="#b6c3a5"/><path d="M-230 0h60m340 0h60M0-230v60m0 340v60" stroke="#b6c3a5"/>${txt(0,-264,'OBJETIVO DE APRENDIZAJE','label muted')}${txt(0,276,'Un hilo conductor, de principio a fin.','tiny muted')}`);

// Connections draw between destinations after the camera has found its subject.
const paths={
  'link-module':'M0 100C0 280-255 275-255 438M0 100V438M0 100C0 280 255 275 255 438',
  'link-unit':'M0 565C0 760-180 720-180 878M0 565C0 760 180 720 180 878',
  'link-chapter':'M-180 1010C-180 1190-480 1150-480 1300M-180 1010C-180 1190-320 1150-320 1300M-180 1010C-180 1190-160 1150-160 1300M-180 1010C-180 1190 0 1150 0 1300M-180 1010C-180 1190 160 1150 160 1300M-180 1010C-180 1190 320 1150 320 1300M-180 1010C-180 1190 480 1150 480 1300M-180 1010C-180 1190 640 1150 640 1300',
  'link-screen':'M-480 1476C-480 1660-440 1610-440 1806M-480 1476C-480 1660-315 1610-315 1806M-480 1476C-480 1660-190 1610-190 1806M-480 1476C-480 1660-65 1610-65 1806M-480 1476C-480 1660 60 1610 60 1806M-480 1476C-480 1660 185 1610 185 1806M-480 1476C-480 1660 310 1610 310 1806M-480 1476C-480 1660 435 1610 435 1806'
};
Object.entries(paths).forEach(([id,d])=>{const el=add(id,`<path d="${d}" class="connection"/>`);$('#world').prepend(el);});

function pose(x=0,y=0,scale=1,alpha=1,rotation=0){return{x,y,scale,autoAlpha:alpha,rotation};}
const states=[];
function state(camera,visible){
  const all={};elements.forEach((_,id)=>all[id]=pose(0,0,.05,0));
  // Each level waits inside its parent before emerging. These fixed hidden
  // positions also make backward travel return objects to their source.
  [0,1,2].forEach(i=>all[`module${i}`]=pose(0,0,.25,0));
  [0,1].forEach(i=>all[`unit${i}`]=pose(0,500,.18,0));
  for(let i=0;i<8;i++){all[`chapter${i}`]=pose(-180,950,.12,0);all[`screen${i}`]=pose(-480,1390,.1,0);}
  all.architecture=pose(0,2400,.08,0);
  cells.forEach(({index})=>all[`cell${index}`]=pose(1800,850,.05,0));
  ['cover','guide-art','banner','banner2'].forEach(id=>all[id]=pose(2600,1580,.05,0));
  for(let i=0;i<5;i++)all[`process${i}`]=pose(3800,1300,.08,0);
  all['pdf-guide']=pose(9200,1600,.08,0);
  all.training=pose(10400,1600,.08,0);
  all.campus=pose(11600,1600,.08,0);
  all.future0=pose(12800,1700,.08,0);all.future1=pose(12800,1700,.08,0);
  all.closing=pose(12800,1700,.7,0);
  productionBoards.forEach(board=>all[board.id]=pose(...board.origin,.12,0));
  Object.keys(paths).forEach(id=>all[id]=pose(0,0,1,0));
  return {camera,poses:Object.assign(all,visible)};
}
const course=pose(0,0,1.35,1,-7);
states.push(state({x:0,y:0,z:1},{course,orbit:pose(0,0,1,1,0)}));
states.push(state({x:0,y:0,z:1.22},{course:pose(0,0,1.42,1,0),orbit:pose(0,0,1.03,.35,23)}));
const modulePos=Object.fromEntries([0,1,2].map(i=>[`module${i}`,pose((i-1)*255,500,.61,1,(i-1)*-5)]));
states.push(state({x:0,y:260,z:1.02},{course:pose(0,0,.82,.7),...modulePos,'link-module':pose()}));
const unitPos={unit0:pose(-180,950,.68,1,-4),unit1:pose(180,950,.68,1,4)};
states.push(state({x:0,y:720,z:1.1},{...unitPos,module1:pose(0,500,.67,.75),'link-unit':pose()}));
const chapterPos=Object.fromEntries(Array.from({length:8},(_,i)=>[`chapter${i}`,pose(-480+i*160,1390,.8,1,(i-3.5)*2)]));
states.push(state({x:40,y:1280,z:.76},{unit0:pose(-180,950,.67,.7),...chapterPos,'link-chapter':pose()}));
const screenPos=Object.fromEntries(Array.from({length:8},(_,i)=>[`screen${i}`,pose(-440+i*125,1890,1,1,(i-3.5)*1.4)]));
states.push(state({x:0,y:1650,z:.93},{chapter0:pose(-480,1390,1,.8),...screenPos,'link-screen':pose()}));
states.push(state({x:0,y:2400,z:1},{phone:pose(0,2400), 'phone-content':pose(0,2400),'phone-lines':pose(0,2400),screen0:pose(-270,2310,.7,.25,-12)}));
states.push(state({x:0,y:2400,z:1},{phone:pose(0,2400),'phone-content':pose(0,2400,1,0),'phone-lines':pose(0,2400,1,0)}));
states.push(state({x:1800,y:850,z:.91},{architecture:pose(1800,850)}));
const mosaic={};
cells.forEach(({index:i})=>mosaic[`cell${i}`]=pose(2600+(i%35-17)*21,1600+(Math.floor(i/35)-10)*27,1,1));
states.push(state({x:2600,y:1600,z:.99},{...mosaic,'mosaic-legend':pose(2600,1600)}));
const evaluated={};
cells.forEach(({index:i,type})=>{
  if(type===0){evaluated[`cell${i}`]=pose(2250+(i%35)*14,1150+(Math.floor(i/35))*15,.6,0);return;}
  const start=type===1?315:type===2?540:660;
  const n=i-start,cols=type===1?15:type===2?12:10;
  evaluated[`cell${i}`]=pose(2600+(type-2)*280+(n%cols-(cols-1)/2)*15.5,1600+(Math.floor(n/cols)-7)*20.5,.82,1);
});
states.push(state({x:2600,y:1580,z:1.05},{...evaluated,'evaluation-labels':pose(2600,1600)}));
states.push(state({x:3800,y:1300,z:1.1},{cover:pose(3565,1290,1.6,1,-10),banner:pose(3815,1175,1.05,1,5),banner2:pose(3820,1380,1.05,1,-4),'guide-art':pose(4070,1310,1.2,1,9),'art-labels':pose(3800,1300)}));
states.push(state({x:4800,y:1600,z:1.5},{...Object.fromEntries([0,1,2,3,4].map(i=>[`process${i}`,pose(4800+(i-2)*160,1600+(i%2?-70:50),1.25,1)])),'process-line':pose(4800,1600,1,1)}));
productionBoards.forEach(board=>states.push(state({x:board.center[0],y:board.center[1],z:1.02},{[board.id]:pose(...board.center)})));
states.push(state({x:10400,y:1600,z:1.08},{'pdf-guide':pose(10400,1600)}));
states.push(state({x:11600,y:1600,z:1.03},{training:pose(11600,1600)}));
states.push(state({x:12800,y:1700,z:1.03},{campus:pose(12800,1700),course:pose(12800,1450,.65,1),future0:pose(12520,1700,.6,1,-7),future1:pose(13080,1700,.6,1,7),orbit:pose(12800,1700,1.14,.45,25)}));
states.push(state({x:12800,y:1450,z:1.05},{course:pose(12800,1450,1.25,1),closing:pose(12800,1450)}));

let current=0;
let master;
let travel;
let textMotion;
let introMotion;
let isScrubbing=false;
let phoneVisible=false;
const camera={x:0,y:0,z:1};
function renderCamera(){
  const zoom=camera.z * (innerWidth<=900 && (current===6||current===7)?1.35:1);
  $('#camera').setAttribute('transform',`translate(${-camera.x*zoom} ${-camera.y*zoom}) scale(${zoom})`);
  const box=$('#atlas').getBoundingClientRect();
  $('#phone-interaction').style.setProperty('--phone-scale',Math.min(box.width/1100,box.height/750)*zoom);
}
function applyState(index){
  Object.entries(states[index].poses).forEach(([id,p])=>gsap.set(elements.get(id),p));
  Object.assign(camera,states[index].camera);renderCamera();
}
function buildTimeline(){
  if(travel)travel.kill();if(master)master.kill();
  applyState(0);
  master=gsap.timeline({paused:true,onUpdate:updatePlayhead,defaults:{ease:'power3.inOut',duration:1.5}});
  master.addLabel('step0',0);
  const ids=[...elements.keys()];
  for(let i=1;i<states.length;i++){
    const start=(i-1)*BEAT;
    const previous=states[i-1].poses;
    master.addLabel(`travel${i}`,start);
    master.to(camera,{...states[i].camera,duration:1.6,onUpdate:renderCamera},start);
    let enterOrdinal=0;
    ids.forEach(id=>{
      const next=states[i].poses[id], prev=previous[id];
      if(Object.keys(next).every(key=>next[key]===prev[key])) return;
      const entering=next.autoAlpha>0 && prev.autoAlpha===0;
      if(entering && (id.includes('labels')||id.includes('legend'))){
        master.set(elements.get(id),{x:next.x,y:next.y,scale:next.scale,rotation:next.rotation},start)
          .to(elements.get(id),{autoAlpha:next.autoAlpha,duration:.55,ease:'power2.out'},start+1.35);
        return;
      }
      let offset=0;
      let duration=1.45;
      if(entering){offset=.38+Math.min(enterOrdinal++*.065,.38);duration=1.3;}
      if(id.startsWith('cell')){
        const cell=Number(id.slice(4));offset=.15+(cell%35)*.018;duration=1.35;
      }
      if(entering && i>=8){
        const {x,y,...appearance}=next;
        master.to(elements.get(id),{x,y,duration:1.6,ease:'power3.inOut'},start)
          .to(elements.get(id),{...appearance,duration,ease:'power3.out'},start+offset);
      }else{
        master.to(elements.get(id),{...next,duration,ease:entering?'power3.out':'power3.inOut'},start+offset);
      }
    });
    // The lid opens in anticipation of the contents. The paper rises first.
    const opening=i===2?'course':i===3?'module1':i===4?'unit0':null;
    if(opening){
      const cover=$(`#${opening} .folder-cover`),paper=$(`#${opening} .folder-paper`);
      master.to(cover,{scaleY:.64,skewX:-10,y:30,duration:.6,ease:'power2.inOut'},start+.05)
        .to(paper,{y:-40,rotation:-3,duration:.65},start+.15)
        .to(cover,{scaleY:1,skewX:0,y:0,duration:.5},start+1.55)
        .to(paper,{y:0,rotation:0,duration:.5},start+1.55);
    }
    const connection=i===2?'link-module':i===3?'link-unit':i===4?'link-chapter':i===5?'link-screen':null;
    if(connection){
      const path=$(`#${connection} path`);
      const length=path.getTotalLength();
      master.fromTo(path,{strokeDasharray:length,strokeDashoffset:length},{strokeDashoffset:0,duration:1.1,ease:'power2.out',immediateRender:false},start+.7);
    }
    if(i===8){
      master.fromTo('.chapter-mark',{opacity:0},{opacity:1,duration:.4,stagger:.009,immediateRender:false},start+1.1);
    }
    if(i===12){
      $$('#process-line path').forEach((path,j)=>{
        const length=path.getTotalLength();
        master.fromTo(path,{strokeDasharray:length,strokeDashoffset:length},{strokeDashoffset:0,duration:.5,ease:'power2.out',immediateRender:false},start+.55+j*.32);
      });
    }
    const board=productionBoards.find(board=>board.scene===i);
    if(board){
      const traveler=$(`#${board.id} .work-traveler`);
      master.fromTo(traveler,{x:-285,y:-118},{x:-285,y:-118,duration:.01,immediateRender:false},start);
      for(let station=0;station<4;station++){
        const ring=$(`#${board.id} .station-ring${station}`),length=ring.getTotalLength();
        const cue=start+.45+station*.47;
        if(station)master.to(traveler,{x:(station-1.5)*190,duration:.38,ease:'power2.inOut'},cue-.25);
        master.fromTo(ring,{strokeDasharray:length,strokeDashoffset:length},{strokeDashoffset:0,duration:.4,ease:'power2.out',immediateRender:false},cue);
      }
      master.fromTo(`#${board.id} .work-approved`,{autoAlpha:0},{autoAlpha:1,duration:.25,immediateRender:false},start+2.1);
      master.fromTo(`#${board.id} .work-batch`,{opacity:0,y:12},{opacity:1,y:0,duration:.35,stagger:{amount:.65},ease:'power2.out',immediateRender:false},start+1.6);
    }
    if(i===16){
      const path=$('#pdf-guide .pdf-route'),length=path.getTotalLength();
      master.fromTo(path,{strokeDasharray:length,strokeDashoffset:length},{strokeDashoffset:0,duration:1.25,ease:'power2.out',immediateRender:false},start+.45)
        .fromTo('#pdf-guide .pdf-step',{opacity:0,y:15,scale:.9},{opacity:1,y:0,scale:1,duration:.55,stagger:.14,ease:'power3.out',immediateRender:false},start+.55)
        .fromTo('#pdf-guide .pdf-source-pages',{opacity:0,x:-309,y:-150,rotation:-8},{opacity:1,x:-285,y:-150,rotation:0,duration:.65,ease:'power3.out',immediateRender:false},start+.65)
        .fromTo('#pdf-guide .pdf-final-cover',{opacity:0,x:305,y:-156,scale:.9},{opacity:1,x:285,y:-156,scale:1,duration:.7,ease:'power3.out',immediateRender:false},start+1.45)
        .fromTo('#pdf-guide .pdf-download-arrow',{opacity:0,y:-9},{opacity:1,y:0,duration:.45,ease:'power3.out',immediateRender:false},start+1.75)
        .fromTo('#pdf-guide .pdf-approved',{opacity:0,scale:.75},{opacity:1,scale:1,duration:.35,ease:'back.out(1.4)',immediateRender:false},start+2.05);
    }
    if(i===17){
      master.fromTo('#training .training-screen',{opacity:0,y:-18,scale:.94},{opacity:1,y:0,scale:1,duration:.75,ease:'power3.out',immediateRender:false},start+.35)
        .fromTo('#training .temuco-pin',{opacity:0,x:-325,y:-257},{opacity:1,x:-325,y:-245,duration:.5,ease:'power3.out',immediateRender:false},start+.5)
        .fromTo('#training .training-person',{opacity:0,scale:.75},{opacity:1,scale:1,duration:.42,stagger:.055,ease:'power3.out',immediateRender:false},start+.75);
      $$('#training .training-link').forEach((path,j)=>{
        const length=path.getTotalLength();
        master.fromTo(path,{strokeDasharray:length,strokeDashoffset:length},{strokeDashoffset:0,duration:.65,ease:'power2.out',immediateRender:false},start+1+j*.1);
      });
      master.fromTo('#training .training-topic',{opacity:0,y:12},{opacity:1,y:0,duration:.5,stagger:.08,ease:'power3.out',immediateRender:false},start+1.45);
    }
    master.addLabel(`step${i}`,i*BEAT);
    // A short hold is encoded as empty playhead time before each next segment.
    master.to({}, {duration:.01}, i*BEAT-.01);
  }
  master.pause(0);
}
function syncQuestion(index,instant=false){
  const visible=index===7;
  if(visible===phoneVisible && !instant)return;
  phoneVisible=visible;
  const panel=$('#phone-interaction');
  gsap.killTweensOf(panel);
  if(visible){
    panel.hidden=false;
    gsap.fromTo(panel,{opacity:0},{opacity:1,duration:reduceMotion.matches||instant?0:.35,delay:instant?0:1.25});
  }else{panel.hidden=true;}
}
function updateCopy(index,animate=true){
  const scene=sceneData[index];
  if(textMotion)textMotion.kill();
  $('#experience').dataset.scene=index;
  $('#eyebrow').textContent=scene.kicker;
  $('#title').innerHTML=scene.title.split('<br>').map(line=>`<span class="line"><span class="word">${line}</span></span>`).join('');
  $('#description').textContent=scene.description;
  $('#fact').innerHTML=`<strong>${scene.fact[0]}</strong><span>${scene.fact[1]}</span>`;
  $('#level-indicator').textContent=scene.level;
  $('#caption').textContent=scene.caption;
  $('#visual-note').textContent=scene.note;
  $('#diagram-desc').textContent=`${scene.description} ${scene.fact.join(' ').replace(/<br>/g,' ')}`;
  $('#current-name').textContent=scene.name;
  $('#counter').textContent=`${String(index+1).padStart(2,'0')} / ${sceneData.length}`;
  $('#next span').textContent=scene.next;
  $('#previous').disabled=index===0;
  $('#guide-title').textContent=$('#title').textContent;
  $('#guide-script').textContent=scene.script;
  $('#announcement').textContent=`${scene.name}. ${scene.description}`;
  $$('#breadcrumbs button').forEach(button=>{
    const active=Number(button.dataset.step)===index;
    button.classList.toggle('active',active);
    if(active)button.setAttribute('aria-current','step');else button.removeAttribute('aria-current');
  });
  if(animate && !reduceMotion.matches){
    textMotion=gsap.timeline().fromTo('#title .word',{yPercent:105,rotation:3},{yPercent:0,rotation:0,stagger:.085,duration:.85,ease:'power4.out'})
      .fromTo('#description, #fact',{opacity:0,y:12},{opacity:1,y:0,duration:.6,stagger:.08,ease:'power3.out'},.25)
      .fromTo('.chapter-kicker, .lower-copy',{opacity:.25},{opacity:1,duration:.5},.1);
  }else gsap.set('#description, #fact, .chapter-kicker, .lower-copy',{opacity:1,y:0});
  syncQuestion(index,!animate||reduceMotion.matches);
}
function updatePlayhead(){
  if(!master)return;
  renderCamera();
  const time=master.time();
  productionBoards.forEach(board=>{
    const progress=Math.max(0,Math.min(1,(time-(board.scene-1)*BEAT-.6)/1.9));
    $(`#${board.id} .work-counter`).textContent=String(Math.round(board.count*(1-Math.pow(1-progress,3))));
  });
  const ratio=time/master.duration();
  $('#scrubber').value=String(Math.round(ratio*1000));
  $('#scrubber').style.setProperty('--progress',`${ratio*100}%`);
  if(isScrubbing){
    const index=Math.max(0,Math.min(sceneData.length-1,Math.round(time/BEAT)));
    if(index!==current){current=index;updateCopy(index,false);}
  }
}
function hashIndex(){const n=location.hash.match(/^#paso-(\d+)$/);return n?Math.max(0,Math.min(sceneData.length-1,Number(n[1])-1)):0;}
function setHash(){try{history.replaceState(null,'',`#paso-${current+1}`);}catch{/* file:// sandbox */}}
function setPause(paused){
  $('#pause').textContent=paused?'▷':'Ⅱ';
  $('#pause').setAttribute('aria-label',paused?'Continuar animación':'Pausar animación');
  const atDestination=master && Math.abs(master.time()/BEAT-Math.round(master.time()/BEAT))<.001;
  $('#experience').dataset.hoverReady=String(Boolean(paused && atDestination));
}

// Hover transforms live inside the film objects. The timeline keeps exclusive
// ownership of their outer transforms, so seeking never records a hover pose.
function prepareHovers(){
  const targets=$$('.folder-object, [id^="chapter"].film-object, [id^="screen"].film-object, [id^="process"].film-object, #cover, #guide-art, #banner, #banner2');
  targets.filter(el=>el.id!=='process-line').forEach(el=>{
    const bounds=el.getBBox();
    const surface=document.createElementNS(NS,'g');
    surface.setAttribute('class','hover-surface');
    while(el.firstChild)surface.append(el.firstChild);
    const hitArea=document.createElementNS(NS,'rect');
    for(const [name,value] of Object.entries({x:bounds.x-6,y:bounds.y-6,width:bounds.width+12,height:bounds.height+12}))hitArea.setAttribute(name,String(value));
    hitArea.setAttribute('class','hover-hit-area');
    el.append(hitArea,surface);
    el.classList.add('hover-object');
    if(el.classList.contains('folder-object'))el.classList.add('hover-folder');
    else if(['cover','guide-art','banner','banner2'].includes(el.id))el.classList.add('hover-art');
    else el.classList.add('hover-card');
  });
}
function go(index,{instant=false,focus=false,replay=false}={}){
  if(index<0||index>=sceneData.length)return;
  if(introMotion){introMotion.kill();gsap.set('#opening',{scale:1,rotation:0,opacity:1});}
  if(travel)travel.kill();
  if(replay){master.seek(Math.max(0,(index-1)*BEAT));}
  current=index;
  updateCopy(index,!instant);
  if(instant||reduceMotion.matches){master.seek(index*BEAT).pause();renderCamera();updatePlayhead();syncQuestion(index,true);setPause(true);}
  else{
    travel=master.tweenTo(`step${index}`,{duration:Math.min(BEAT,Math.max(.8,Math.abs(index*BEAT-master.time()))),ease:'none',onComplete:()=>setPause(true)});
    setPause(false);
  }
  setHash();
  if(focus){$('#title').focus({preventScroll:true});if(innerWidth<=900)scrollTo({top:0,behavior:'instant'});}
}
function togglePause(){
  if(introMotion?.isActive()){introMotion.pause();setPause(true);return;}
  if(introMotion?.paused() && introMotion.progress()<1){introMotion.play();setPause(false);return;}
  if(!travel)return;
  if(travel.progress()===1)return;
  travel.paused(!travel.paused());setPause(travel.paused());
}
function replay(){
  if(current===0){
    if(introMotion)introMotion.kill();
    if(travel)travel.kill();
    master.pause(0);renderCamera();updateCopy(0);
    if(!reduceMotion.matches){introMotion=gsap.timeline({onStart:()=>setPause(false),onComplete:()=>setPause(true)}).fromTo('#opening',{scale:.86,rotation:-6,opacity:0},{scale:1,rotation:0,opacity:1,duration:1.5,ease:'power3.out'},0);}
    return;
  }
  go(current,{replay:true});
}
function fullscreen(){
  const promise=document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen?.();
  promise?.catch(()=>$('#announcement').textContent='Puedes activar pantalla completa con F11.');
}

[['Curso',1],['Módulo',2],['Unidad',3],['Capítulo',4],['Pantalla',5]].forEach(([label,step],i)=>{
  const button=document.createElement('button');button.textContent=label;button.dataset.step=step;
  button.addEventListener('click',()=>go(step,{focus:true}));
  if(i){const sep=document.createElement('span');sep.className='separator';sep.textContent='›';sep.setAttribute('aria-hidden','true');$('#breadcrumbs').append(sep);}
  $('#breadcrumbs').append(button);
});
$('#timeline-ticks').innerHTML=sceneData.map(()=>'<i></i>').join('');
$('#next').addEventListener('click',()=>go(current===sceneData.length-1?0:current+1,{focus:true}));
$('#previous').addEventListener('click',()=>go(current-1,{focus:true}));
$('#pause').addEventListener('click',togglePause);
$('#replay').addEventListener('click',replay);
$('#fullscreen').addEventListener('click',fullscreen);
$('.brand').addEventListener('click',event=>{event.preventDefault();go(0,{focus:true});});
$('#guide-open').addEventListener('click',()=>{if(travel?.isActive()){travel.pause();setPause(true);}$('#guide').showModal();});
$('#guide-close').addEventListener('click',()=>$('#guide').close());
$('#scrubber').addEventListener('input',event=>{
  if(introMotion){introMotion.kill();gsap.set('#opening',{scale:1,rotation:0,opacity:1});}
  if(travel)travel.kill();
  if(textMotion)textMotion.kill();
  gsap.set('#description, #fact, .chapter-kicker, .lower-copy',{opacity:1,y:0});
  gsap.set('#title .word',{yPercent:0,rotation:0});
  const desiredTime=Number(event.target.value)/1000*master.duration();
  isScrubbing=true;
  master.time(desiredTime).pause();
  isScrubbing=false;setPause(true);setHash();syncQuestion(current,true);
});
$$('[data-answer]').forEach(button=>button.addEventListener('click',()=>{
  $$('[data-answer]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
  const correct=button.dataset.answer==='correct';
  const feedback=$('#feedback');feedback.hidden=false;feedback.classList.toggle('wrong',!correct);
  feedback.textContent=correct?'Así es. La interdependencia expresa que ambos se necesitan y se regulan mutuamente.':'Miremos la relación: Yin y Yang se necesitan. La interdependencia describe su vínculo mutuo.';
  if(!reduceMotion.matches)gsap.fromTo(feedback,{opacity:0,y:5},{opacity:1,y:0,duration:.25});
}));
window.addEventListener('keydown',event=>{
  if($('#guide').open||event.ctrlKey||event.metaKey||event.altKey||event.target.closest('input,textarea,select,[contenteditable="true"]'))return;
  if(event.key===' '&&event.target.closest('button,a'))return;
  if(['ArrowRight','PageDown',' '].includes(event.key)){event.preventDefault();go(Math.min(current+1,sceneData.length-1),{focus:true});}
  if(['ArrowLeft','PageUp'].includes(event.key)){event.preventDefault();go(current-1,{focus:true});}
  if(event.key.toLowerCase()==='p')togglePause();
  if(event.key.toLowerCase()==='r')replay();
  if(event.key.toLowerCase()==='f')fullscreen();
  if(event.key==='Home'){event.preventDefault();go(0,{focus:true});}
  if(event.key==='End'){event.preventDefault();go(sceneData.length-1,{focus:true});}
});
window.addEventListener('hashchange',()=>go(hashIndex()));
window.addEventListener('resize',renderCamera);
reduceMotion.addEventListener('change',()=>go(current,{instant:true}));

if(!window.gsap){
  $('#title').textContent='Falta el motor de animación.';
  $('#description').textContent='Mantén la carpeta vendor junto a index.html para abrir el atlas sin conexión.';
}else{
  prepareHovers();
  gsap.set('.film-object',{svgOrigin:'0 0'});
  buildTimeline();
  current=hashIndex();go(current,{instant:true});
  if(current===0&&!reduceMotion.matches)replay();
}
