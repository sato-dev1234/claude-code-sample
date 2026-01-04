#!/usr/bin/env python3
"""
チケットID自動採番スクリプト

Usage:
    python next_ticket_id.py <tickets_path> <prefix> [digits]

Args:
    tickets_path: チケットディレクトリのパス
    prefix: チケットIDプレフィックス (例: "PROJ-", "TICKET-", "ISS-")
    digits: 数字部分の桁数 (省略時: 5)

Output:
    成功時: 次のチケットID (stdout)
    失敗時: エラーメッセージ (stderr) + exit code 1

Examples:
    $ python next_ticket_id.py /path/to/tickets "PROJ-" 5
    PROJ-00001

    $ python next_ticket_id.py /path/to/tickets "TASK-"
    TASK-00001
"""
import sys
import re
from pathlib import Path


def scan_existing_ids(tickets_path: Path, prefix: str, digit_count: int) -> list[int]:
    """
    既存チケットから番号リストを取得

    Args:
        tickets_path: チケットディレクトリ
        prefix: チケットIDプレフィックス
        digit_count: 数字部分の桁数

    Returns:
        既存の番号リスト (例: [1, 2, 5, 132])
    """
    id_pattern = re.compile(f'^{re.escape(prefix)}(\\d{{{digit_count}}})$')
    numbers = []

    if not tickets_path.exists():
        return numbers

    # 全ステータスディレクトリをスキャン
    for status_dir in tickets_path.iterdir():
        if not status_dir.is_dir():
            continue

        # トップレベルのチケットディレクトリのみ対象
        for ticket_dir in status_dir.iterdir():
            if not ticket_dir.is_dir():
                continue

            match = id_pattern.match(ticket_dir.name)
            if match:
                numbers.append(int(match.group(1)))

    return numbers


def generate_next_id(prefix: str, digit_count: int, existing_numbers: list[int]) -> str:
    """
    次のチケットIDを生成

    Args:
        prefix: チケットIDプレフィックス
        digit_count: 数字部分の桁数
        existing_numbers: 既存の番号リスト

    Returns:
        次のチケットID
    """
    next_number = max(existing_numbers, default=0) + 1
    return f"{prefix}{next_number:0{digit_count}d}"


def has_duplicate(tickets_path: Path, ticket_id: str) -> bool:
    """
    チケットIDが既に存在するかを判定

    Args:
        tickets_path: チケットディレクトリ
        ticket_id: チェックするチケットID

    Returns:
        True: 既に存在する, False: 存在しない
    """
    if not tickets_path.exists():
        return False

    for status_dir in tickets_path.iterdir():
        if not status_dir.is_dir():
            continue
        if (status_dir / ticket_id).exists():
            return True
    return False


def main():
    if len(sys.argv) < 3 or len(sys.argv) > 4:
        print("Usage: python next_ticket_id.py <tickets_path> <prefix> [digits]", file=sys.stderr)
        sys.exit(1)

    tickets_path = Path(sys.argv[1])
    prefix = sys.argv[2]
    digit_count = int(sys.argv[3]) if len(sys.argv) == 4 else 5

    try:
        # 重複を避けるため既存の番号を把握
        existing_numbers = scan_existing_ids(tickets_path, prefix, digit_count)

        # 最大番号+1で一意性を保証
        next_id = generate_next_id(prefix, digit_count, existing_numbers)

        # 競合状態への安全策として最終確認
        if has_duplicate(tickets_path, next_id):
            print(f"エラー: 生成されたID {next_id} が既に存在します", file=sys.stderr)
            sys.exit(1)

        # 成功: IDを出力
        print(next_id)

    except ValueError as e:
        print(f"エラー: {e}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"予期しないエラー: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
