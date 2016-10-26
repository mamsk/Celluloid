function incrementTime()
{
    $("#time").text(Number($("#time").text()) + 1);
    for (i = 0; newWorld[i]; i++) {
        for (j = 0; newWorld[i][j]; j++) {
            world[i][j].antiVaccins = newWorld[i][j].antiVaccins;
            world[i][j].vivants = newWorld[i][j].vivants,
            world[i][j].sains = newWorld[i][j].sains,
            world[i][j].vaccines = newWorld[i][j].vaccines,
            world[i][j].gueris = newWorld[i][j].gueris
        }
    }
}

function popGenerator(antiV, alives, healthy, immune, cured)
{
  pop = {
    antiVaccins: antiV,
    vivants: alives,
    sains: healthy,
    vaccines: immune,
    gueris: cured,
    pmax: 0,
    pmin: 0,
    K1: 0,
    K2: 0,
    M0: 0,
    vmax: 0,

    setRandomValues: function(pmax, pmin, K1, K2, M0, vmax){
        this.pmax = pmax;
        this.pmin = pmin;
        this.K1 = K1;
        this.k2 = K2;
        this.M0 = M0;
        this.vmax = vmax;
    },
    pickRandomValues: function(){
        this.pmax = (Math.random() * 0.1) + 0.8;
        this.pmin = (Math.random() * 0.1) + 0.1;
        this.K1 = (Math.random() * 0.2) + 0.5;
        this.K2 = Math.random() + 0.5;
        this.M0 = Math.round(Math.random() * 10) / Number($("#cell_pop").val());
        this.vmax = (Math.random() * 0.3) + 0.5;
    },
    // fonctions bien utiles pour rendre le tout plus clair
    getMorts: function(){
        return (1 - this.vivants);
    },
    getMalades: function(){
        var malades = 1 - this.sains;
        var morts = 1 - this.vivants;
        return (malades - morts);
    },
    getVaccines: function(){
        return (this.vivants * this.vaccines);
    },
    getSensibles: function(){
        var malades = 1 - this.sains;
        var morts = 1 - this.vivants;
        var immunises = this.vaccines + this.gueris;

        return((this.vivants - immunises) * (1 - (malades - morts)));
    },
    getProVaccins: function(){
        return((this.vivants-this.gueris-this.vaccines) * (1-this.antiVaccins));
    },
    getAntiVaccins: function(){
        return((this.vivants-this.gueris-this.vaccines) * this.antiVaccins);
    },
    getImmunises: function(){
        return(this.vaccines + this.gueris);
    }
  };

  return pop;
}


function initProcess()
{
    var size_x = $("#size_x").val();
    var size_y = $("#size_y").val();
    var p0x = $("#patient0_x").val();
    var p0y = $("#patient0_y").val();
    var pop = $("#cell_pop").val();;
    world = [];

    for (i = 0; i < size_x; i++)
    {
        var line = []
        for (j = 0; j < size_y; j++) {
            if(i == p0x && j == p0y) {
                line[j] = popGenerator(1, 1, 1-(1/pop), 0, 0);
            } else {
                line[j] = popGenerator(1, 1, 1, 0, 0);                
            }
            line[j].pickRandomValues();
        }
        world[i] = line;
    }
    $("#time").text("0");
    resizeCanva();
    drawWorld();
}

function drawWorld()
{
  var x = Number($("#size_x").val());
  var y = Number($("#size_y").val());
  var size = Number($("#cell_size").val());
  var monitor1 = $("#monitor1").val();
  var monitor2 = $("#monitor2").val();
  var monitor3 = $("#monitor3").val();
  var cellPop = Number($("#cell_pop").val());
    var monitorCellX = Number($("#X_case").text());
    var monitorCellY = Number($("#Y_case").text());

  $('#main_canva').clearCanvas();

    if (monitorCellX && monitorCellY) {
        $("#pct_survivants").text(Math.round(world[monitorCellX][monitorCellY].vivants * cellPop)/(cellPop/100));
        $("#pct_malades").text(Math.round((1 - world[monitorCellX][monitorCellY].sains) * cellPop)/(cellPop/100));
        $("#pct_vaccines").text(Math.round(world[monitorCellX][monitorCellY].vaccines * cellPop)/(cellPop/100));
        $("#pct_gueris").text(Math.round(world[monitorCellX][monitorCellY].gueris * cellPop)/(cellPop/100));
        $("#pct_antiv").text(Math.round(world[monitorCellX][monitorCellY].antiVaccins * cellPop)/(cellPop/100));
        $("#pct_prov").text(Math.round((1 - world[monitorCellX][monitorCellY].antiVaccins) * cellPop)/(cellPop/100));
//        $("#pct_antiv").text(Math.round(world[monitorCellX][monitorCellY].getAntiVaccins() * cellPop)/(cellPop/100));
//        $("#pct_prov").text(Math.round(world[monitorCellX][monitorCellY].getProVaccins() * cellPop)/(cellPop/100));
    }

  for (i = 0; i < x; i++) {
    for (j = 0; j < y; j++){
      var center_x = size * ( i + 1/2);
      var center_y = size * ( j + 1/2);
      color = Math.round(world[i][j][monitor1]*255);
      $('#main_canva').drawRect({
        layer: true,
        strokeStyle: '#000',
        strokeWidth: 1,
        fillStyle: 'rgb(255,'+color+',255)',
        x: center_x,
        y: center_y,
        width: size - 2,
        height: size - 2,
        click: function(layer) {
          case_X = Math.floor(layer.eventX/size);
          case_Y = Math.floor(layer.eventY/size);
          $("#X_case").text(case_X);
          $("#Y_case").text(case_Y);
          $("#pct_survivants").text(Math.round(world[case_X][case_Y].vivants * cellPop)/(cellPop/100));
          $("#pct_malades").text(Math.round(world[case_X][case_Y].getMalades() * cellPop)/(cellPop/100));
          $("#pct_vaccines").text(Math.round(world[case_X][case_Y].getVaccines() * cellPop)/(cellPop/100));
          $("#pct_gueris").text(Math.round(world[case_X][case_Y].gueris * cellPop)/(cellPop/100));
          $("#pct_antiv").text(Math.round(world[case_X][case_Y].getAntiVaccins() * cellPop)/(cellPop/100));
          $("#pct_prov").text(Math.round(world[case_X][case_Y].getProVaccins() * cellPop)/(cellPop/100));
        }
      });
      color = Math.round(world[i][j][monitor2]*255);
      $('#second_canva').drawRect({
        layer: true,
        strokeStyle: '#000',
        strokeWidth: 1,
        fillStyle: 'rgb(255,255 ,'+color+')',
        x: center_x,
        y: center_y,
        width: size - 2,
        height: size - 2
      });
      color = Math.round((1-world[i][j][monitor3])*255);
      $('#third_canva').drawRect({
        layer: true,
        strokeStyle: '#000',
        strokeWidth: 1,
        fillStyle: 'rgb('+color+',255 ,255)',
        x: center_x,
        y: center_y,
        width: size - 2,
        height: size - 2,
      });
    
    }
  }
}
