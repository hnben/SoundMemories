export default function MoodButtons() {
    return (
        <section>
            <br />
            <p>How are you feeling today? (filter recordings)</p>
            <input type="submit" name="sad" value="sad" />
            <input type="submit" name="happy" value="happy" />
            <input type="submit" name="encouraging" value="encouraging" />
            <input type="submit" name="random" value="random" />
            
            {/* <form>
                <label for="mood">Filter by mood:</label>
                <br />
                <select type="submit" name="mood" id="mood">
                    <option value="sad">Sad</option>
                    <option value="happy">Happy</option>
                    <option value="encouraging">Encouraging</option>
                    <option value="random">Random</option>
                </select>
            </form> */}
        </section>
    );
}
