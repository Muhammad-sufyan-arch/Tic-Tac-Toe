 /* ── State ──────────────────────────────────────────────────── */
    const WIN_COMBOS = [
      [0,1,2],[3,4,5],[6,7,8], // rows
      [0,3,6],[1,4,7],[2,5,8], // cols
      [0,4,8],[2,4,6]          // diags
    ];

    let board        = Array(9).fill(null);
    let currentPlayer = 'X';
    let gameOver     = false;
    let scores       = { X: 0, O: 0, D: 0 };

    /* ── DOM refs ───────────────────────────────────────────────── */
    const cells          = [...document.querySelectorAll('.cell')];
    const turnIndicator  = document.getElementById('turnIndicator');
    const turnMark       = document.getElementById('turnMark');
    const resultOverlay  = document.getElementById('resultOverlay');
    const resultEmoji    = document.getElementById('resultEmoji');
    const resultText     = document.getElementById('resultText');
    const resultSub      = document.getElementById('resultSub');
    const playAgainBtn   = document.getElementById('playAgainBtn');
    const resetBtn       = document.getElementById('resetBtn');
    const newBtn         = document.getElementById('newBtn');
    const scoreX         = document.getElementById('scoreX');
    const scoreO         = document.getElementById('scoreO');
    const scoreDraw      = document.getElementById('scoreDraw');

    /* ── Core game logic ────────────────────────────────────────── */
    function checkWinner() {
      for (const [a,b,c] of WIN_COMBOS) {
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
          return { winner: board[a], combo: [a,b,c] };
        }
      }
      if (board.every(Boolean)) return { winner: null, combo: null, draw: true };
      return null;
    }

    function handleCellClick(e) {
      const idx = +e.currentTarget.dataset.index;
      if (gameOver || board[idx]) return;

      board[idx] = currentPlayer;
      renderCell(idx, currentPlayer, true);

      const result = checkWinner();
      if (result) {
        gameOver = true;
        if (result.draw) {
          setTimeout(() => showResult('draw', null), 420);
        } else {
          highlightWinners(result.combo);
          setTimeout(() => showResult('win', result.winner), 520);
        }
      } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        updateTurnUI();
      }
    }

    function renderCell(idx, player, animate) {
      const cell = cells[idx];
      cell.textContent = player;
      cell.classList.add('taken', player === 'X' ? 'x-cell' : 'o-cell');
      if (animate) {
        cell.classList.remove('just-placed');
        void cell.offsetWidth; // reflow to restart animation
        cell.classList.add('just-placed');
      }
    }

    function highlightWinners(combo) {
      combo.forEach(i => cells[i].classList.add('winner-cell'));
    }

    /* ── UI helpers ─────────────────────────────────────────────── */
    function updateTurnUI() {
      turnMark.textContent = currentPlayer;
      turnIndicator.className = 'turn-indicator ' + (currentPlayer === 'X' ? 'x-turn' : 'o-turn');
    }

    function showResult(type, winner) {
      if (type === 'win') {
        const isX = winner === 'X';
        resultEmoji.textContent = isX ? '🏆' : '🎉';
        resultText.textContent  = `Player ${winner} wins!`;
        resultText.className    = `result-text ${isX ? 'x-wins' : 'o-wins'}`;
        resultSub.textContent   = isX ? 'X dominates the grid' : 'O conquers the board';
        scores[winner]++;
      } else {
        resultEmoji.textContent = '🤝';
        resultText.textContent  = "It's a draw!";
        resultText.className    = 'result-text draw';
        resultSub.textContent   = 'Perfectly matched players';
        scores.D++;
      }
      updateScoreUI();
      resultOverlay.classList.add('show');
    }

    function updateScoreUI() {
      scoreX.textContent    = scores.X;
      scoreO.textContent    = scores.O;
      scoreDraw.textContent = scores.D;
    }

    /* ── Round & game reset ─────────────────────────────────────── */
    function resetRound() {
      board          = Array(9).fill(null);
      currentPlayer  = 'X';
      gameOver       = false;
      cells.forEach(cell => {
        cell.textContent = '';
        cell.className   = 'cell';
      });
      resultOverlay.classList.remove('show');
      updateTurnUI();
    }

    function newGame() {
      scores = { X: 0, O: 0, D: 0 };
      updateScoreUI();
      resetRound();
    }

    /* ── Event listeners ────────────────────────────────────────── */
    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    playAgainBtn.addEventListener('click', resetRound);
    resetBtn.addEventListener('click', resetRound);
    newBtn.addEventListener('click', newGame);

    /* ── Init ───────────────────────────────────────────────────── */
    updateTurnUI();