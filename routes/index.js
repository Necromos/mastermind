// size = długość dim = zakres liczb

exports.index = function (req, res) {
    req.session.puzzle = req.session.puzzle || req.app.get('puzzle');
    res.render('index', {
        title: 'Mastermind'
    });
};

exports.play = function (req, res) {
    var newGame = function () {
        var i, data = [], puzzle = req.session.puzzle;
        for (i = 0; i < puzzle.size; i += 1) {
            data.push(Math.floor(Math.random() * puzzle.dim));
        }
        req.session.puzzle.data = data;
        return {
            'size': req.session.puzzle.size,
            'dim': req.session.puzzle.dim,
            'max': req.session.puzzle.max
        };
    };
    // poniższa linijka jest zbędna (przy założeniu, że
    // play zawsze uzywany będzie po index) – w końcowym
    // rozwiązaniu można ją usunąć.
    req.session.puzzle = req.session.puzzle || req.app.get('puzzle');
    /*
     * req.params[2] === wartość size
     * req.params[4] === wartość dim
     * req.params[6] === wartość max
     */
    if (req.params[2]) {
        req.session.puzzle.size = req.params[2];
    }
    else {
        req.session.puzzle.size = 5;
    }
    if (req.params[4]) {
        req.session.puzzle.dim = req.params[4];
    }
    else {
        req.session.puzzle.dim = 9;
    }
    if (req.params[6]) {
        req.session.puzzle.max = req.params[6];
    }
    else {
        req.session.puzzle.max = null;
    }
    req.session.puzzle.playerTry = 0;
    res.end(JSON.stringify(newGame()));
};

exports.mark = function (req, res) {
    var markAnswer = function () {
        var done = 0;
        var retMsg = "Niestety dalej brakuje Tobie celności.";
        var move = req.params[0].split('/');
        move = move.slice(0, move.length - 1);
        var parseMove = [];
        move.forEach(function(el){
            parseMove.push(parseInt(el));
        });
        move = parseMove;
        var data = req.session.puzzle.data;
        console.log(data);
        var hit = 0;
        var closeHit = 0;
        var data = req.session.puzzle.data;
        var dataTmp = [];
        var moveTmp = [];
        for (var i = 0; i<move.length; i++){
            if (move[i] === data[i]) {
                hit++;
            }
            else {
                dataTmp.push(data[i]);
                moveTmp.push(move[i]);
            }
        }
        data = dataTmp;
        move = moveTmp;
        if (req.session.puzzle.size === hit){
            retMsg = "Gratulacje! Udało się Tobie odnaleźć kombinację!"
            done = 1;
        }
        else {
            for (var i = 0; i<move.length; i++){
                for (var j = 0; j<data.length; j++){
                    if (move[i] === data[j]){
                        closeHit++;
                        data.splice(j,1);
                        move.splice(i,1);
                        move = moveTmp;
                        i--;
                        break;
                    }
                }    
            }
        }
        if (req.session.puzzle.max !== null){
            req.session.puzzle.playerTry++;
            console.log(req.session.puzzle.playerTry);
            console.log(req.session.puzzle.max);
            if (req.session.puzzle.playerTry == req.session.puzzle.max){
                retMsg = "Skończyły się Twoje próby, poprawna kombinacja to: " + req.session.puzzle.data;
                done = 2;
            }
        }
        return {
            'hit': hit,
            'closeHit': closeHit,
            'done': done,
            'retMsg': retMsg
        };
    };
    res.end(JSON.stringify(markAnswer()));
};
