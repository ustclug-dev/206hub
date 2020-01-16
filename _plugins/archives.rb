module Jekyll
  class Site
    def tags
      @manipulated_tags ||= begin
        hash = Hash.new { |h, k| h[k] = [] }
        collections.each do |name, collection|
          collection.docs.each do |doc|
            doc.data["tags"]&.each { |t| hash[t] << doc }
            doc.data["comments"]&.each do |c|
              c["tags"]&.each { |t| hash[t] << doc }
            end
          end
        end
        hash.each_value { |posts| posts.sort!.reverse!.uniq! }
      end
    end
  end

  module Archives
    class Archives
      def tags
        @site.tags
      end

      def read_tags
        if enabled? "tags"
          tags.each do |title, posts|
            # Jekyll.logger.warn "TAGS: title: #{title}, posts: #{posts}"
            @archives << Archive.new(@site, title, "tag", posts)
          end
        end
      end

      def categories
        @site.collections
      end

      def read_categories
        if enabled? "categories"
          categories.each do |title, posts|
            if title == "posts"
              next
            end
            # Jekyll.logger.warn "COLLECTIONS: title: #{title}, posts: #{posts.docs}"
            @archives << Archive.new(@site, title, "category", posts.docs)
          end
        end
      end
    end
  end
end
