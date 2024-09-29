import numpy as np

class VerifyHuman:
    def typingPoss(self, typingSpeed):
        try:
            std = np.std(typingSpeed)
            if std > 300:
                return 5
            elif std > 150:
                return 4
            elif std > 75:
                return 3
            elif std > 30:
                return 2
            else:
                return 1
        except Exception as e:
            print(f"An Exception at typingPoss: {e}")
            return 1

    def mouseMovPoss(self, movements):
        def calculate_distance(pos1, pos2):
            return np.sqrt((pos2.x - pos1.x)**2 + (pos2.y - pos1.y)**2)

        try:
            if len(movements) < 2:
                return 1

            distances = [calculate_distance(movements[i], movements[i+1]) for i in range(len(movements) - 1)]
            var = np.var(distances)
            if var > 10000:
                return 5
            elif var > 5000:
                return 4
            elif var > 2000:
                return 3
            elif var > 500:
                return 2
            else:
                return 1
        except Exception as e:
            print(f"An Exception at mouseMovPoss: {e}")
            return 1

    def clickPoss(self, clicks):
        try:
            return 3 if clicks > 2 else 1
        except Exception as e:
            print(f"An Exception at clickPoss: {e}")
            return 1

    def tabChangePoss(self, tabChanges):
        try:
            return 3 if tabChanges > 0 else 1
        except Exception as e:
            print(f"An Exception at clickPoss: {e}")
            return 1

def verifyHuman(data):
    v = VerifyHuman()
    score = [
        v.typingPoss(data.typingSpeed),
        v.mouseMovPoss(data.mouseMovements),
        v.clickPoss(data.clicks),
        v.tabChangePoss(data.tabChanges)
    ]
    avg = sum(score) / len(score)
    print(score)
    print(avg)
    if avg > 2:
        return True
    else:
        return False
