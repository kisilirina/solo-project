const divAllGames = document.querySelector('[data-games]')
const buttonGetGame = document.querySelector('#getGames');

if (buttonGetGame) {
  buttonGetGame.addEventListener('click', async (event) => {
    const orderBy = document.querySelector('.order__by').value;
    const minPlayers = document.querySelector('.min__players').value;
    const limit = document.querySelector('.limit').value;

    const response = await fetch(`https://api.boardgameatlas.com/api/search?limit=${limit}&order_by=${orderBy}&min_players=${minPlayers}&client_id=JLBr5npPhV`);
    const gamesList = (await response.json()).games.filter( el => el.price_text !== 'N/A');

    const hbsResponse = await fetch('/views/games.hbs');
    const hbsText = await hbsResponse.text();
    const template = Handlebars.compile(hbsText);
    const findGamesHtml = template({ gamesList });

    divAllGames.innerHTML = findGamesHtml; //можно использовать insertAdjacentHTML


  })
}


