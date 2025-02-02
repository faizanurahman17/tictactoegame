import time
import os

def clear_screen():
    os.system('cls' if os.name == 'nt' else 'clear')

def print_board(board):
    clear_screen()
    print("🎮 TIC-TAC-TOE 🎮")
    print("✨ Anime Edition ✨")
    print("===================")
    for row in board:
        print(" | ".join(row))
        print("-" * 9)

def check_winner(board):
    # Check rows
    for row in board:
        if row[0] == row[1] == row[2] != " ":
            return row[0]

    # Check columns
    for col in range(3):
        if board[0][col] == board[1][col] == board[2][col] != " ":
            return board[0][col]

    # Check diagonals
    if board[0][0] == board[1][1] == board[2][2] != " ":
        return board[0][0]
    if board[0][2] == board[1][1] == board[2][0] != " ":
        return board[0][2]

    return None

def is_board_full(board):
    for row in board:
        if " " in row:
            return False
    return True

def animate_win(winner_name):
    clear_screen()
    print("🎉✨🎉✨🎉✨🎉✨🎉✨🎉✨🎉✨🎉")
    print(f"  {winner_name} wins! 🏆")
    print("🎉✨🎉✨🎉✨🎉✨🎉✨🎉✨🎉✨🎉")
    time.sleep(2)

def animate_tie():
    clear_screen()
    print("🤝 It's a tie! 🤝")
    print("Better luck next time! 🌸")
    time.sleep(2)

def tic_tac_toe():
    board = [[" " for _ in range(3)] for _ in range(3)]
    player_x = input("Enter your name (Player X): ")
    player_o = input("Enter your name (Player O): ")
    current_player = player_x
    current_symbol = "X"

    while True:
        print_board(board)
        print(f"{current_player}'s turn ({current_symbol}) 🌸")

        try:
            row = int(input("Enter row (0, 1, 2): "))
            col = int(input("Enter column (0, 1, 2): "))
        except ValueError:
            print("Invalid input! Please enter numbers only.")
            time.sleep(1)
            continue

        if row < 0 or row > 2 or col < 0 or col > 2:
            print("Invalid row or column! Try again.")
            time.sleep(1)
            continue

        if board[row][col] != " ":
            print("Cell already taken! Try again.")
            time.sleep(1)
            continue

        board[row][col] = current_symbol

        winner_symbol = check_winner(board)
        if winner_symbol:
            winner_name = player_x if winner_symbol == "X" else player_o
            print_board(board)
            animate_win(winner_name)
            break

        if is_board_full(board):
            print_board(board)
            animate_tie()
            break

        # Switch players
        current_player = player_o if current_player == player_x else player_x
        current_symbol = "O" if current_symbol == "X" else "X"

if __name__ == "__main__":
    tic_tac_toe()